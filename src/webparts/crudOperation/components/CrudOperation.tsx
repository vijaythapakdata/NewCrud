import * as React from 'react';
// import styles from './CrudOperation.module.scss';
import type { ICrudOperationProps } from './ICrudOperationProps';
import {spfi} from "@pnp/sp/presets/all"
import {SPFx} from "@pnp/sp/presets/all";
import { DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, IconButton, PrimaryButton, SelectionMode, TextField } from '@fluentui/react';

interface ICrudOperationState{
  Title:string;
  EmailAddress:string;
  Id:number;

}
interface ICrud{
  name:string;
  email:string;
  id:number;
}
const CrudOperation =(props:ICrudOperationProps):React.ReactElement=>{
  const _sp=spfi().using(SPFx(props.context));
const[reload,setReload]=React.useState<boolean>(false);
const [states,setStates]=React.useState<Array<ICrud>>([]);
const[currentId,setCurrentId]=React.useState<number|any>();
const[editName,setEditName]=React.useState<string>('');
const[editEmail,setEditEmail]=React.useState<string>('');
const [newName,setNewName]=React.useState<string>('');
const[newEmail,setNewEmail]=React.useState<string>('');
const[isEditHidden,setIsEditHidden]=React.useState<boolean>(true);
const[isAddHidden,setIsAddHidden]=React.useState<boolean>(true);
//
React.useEffect(()=>{
  _getListItems();
},[reload]);

  const _getListItems=async()=>{
    try{
      const _getListItems=await _sp.web.lists.getByTitle(props.ListName).items();
//seeting the list item to the state
setStates(_getListItems.map((each:ICrudOperationState)=>({
  name:each.Title,
  email:each.EmailAddress,
  id:each.Id
})))
    
}
catch(err){
  console.log(err);
}
finally{
  console.log("List items fetched",states);
}
  }
  const handleName=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setNewName(event.target.value);
  }
  const handleEmail=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setNewEmail(event.target.value);
  }
  //create item
  const _createListItems=async()=>{
    const list_=_sp.web.lists.getByTitle(props.ListName);
    try{
await list_.items.add({
  Title:newName,
  Email:newEmail
});
//close the add modal dialog
setIsAddHidden(true);
setReload(!reload);
console.log("List item is created");
    }
    catch(err){
console.log(err);
    }
    finally{
setIsAddHidden(true);
    }
  }
  const openEditDialog=(id:number)=>{
    setCurrentId(id);
    //thhis function would open the edit dialog and expose a form to edit the item
    const quote:ICrud|undefined=states.find((each:ICrud)=>each.id===id);
    if(quote){
      setEditName(quote.name);
      setEditEmail(quote.email);
    }
  }
  const handleEditEmail=(event:React.ChangeEvent<HTMLInputElement>)=>{
  setEditEmail(event.target.value);
  }
  const handleEditName=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setEditName(event.target.value);
  }
  //update item
  const _updateListItems=async()=>{
    const list_=_sp.web.lists.getByTitle(props.ListName);
    try{
await list_.items.getById(currentId).update({
  Title:editName,
  EmailAddress:editEmail
})
//close the edit modal dialog
setIsEditHidden(true);
setReload(!reload);
console.log("List item is updated");
    }
    catch(err){
console.log(err);
    }
    finally{
setIsEditHidden(true);

    }
  }
  //delete item
  const _deleteListItems=async(id:number)=>{

    const list_=_sp.web.lists.getByTitle(props.ListName);
    try{
await list_.items.getById(id).delete();
setReload(!reload);
console.log("List item is deleted");
    }
    catch(err){
console.log(err);
    }
  }
  return(
    <>
    <div className='titlebox'>
      <h2>Crud Operation</h2>
      <div className='nameContainer'>
        <DetailsList
        items={states||[]}
        columns={[
          {
            key:'NameColumn',
            name:'Name',
            fieldName:'Name',
            minWidth:100,
            isResizable:true,
            onRender:(item:ICrud)=><div>{item.name}</div>
          },
           {
            key:'EmailColumn',
            name:'Email',
            fieldName:'Email',
            minWidth:100,
            isResizable:true,
            onRender:(item:ICrud)=><div>{item.email}</div>
          },
          {
            key:'ActionColumn',
            name:'Actions',
            fieldName:'Actions',
            minWidth:100,
            isResizable:true,
            onRender:(item:ICrud)=>(
              <div>
                <IconButton
                iconProps={{iconName:'Edit'}}
                title='Edit'
                ariaLabel='Edit'
                onClick={()=>openEditDialog(item.id)}
                />
                <IconButton
                iconProps={{iconName:'delete'}}
                title='Delete'
                ariaLabel='Delete'
                onClick={()=>_deleteListItems(item.id)}
                />
                </div>
            )
          }
        ]}
        selectionMode={SelectionMode.none}
        />
        <Dialog
        hidden={isEditHidden}
        onDismiss={()=>setIsEditHidden(true)}
        dialogContentProps={{
          title:'Edit Item',
          type:DialogType.normal
        }}

        >
        <div>
           <TextField
      label='Name'
      value={editName}
      onChange={handleEditName}

      />
 <TextField
      label='Email'
      value={editEmail
      }
      onChange={handleEditEmail}
      
      />
        </div>
        <DialogFooter>
          <PrimaryButton
          onClick={()=>_updateListItems()}
          text='Save'

          />
          <DefaultButton
          onClick={()=>setIsEditHidden(true)}
          />
        </DialogFooter>
        </Dialog>

      </div>
      <div>
        <PrimaryButton text='Add Item' onClick={()=>setIsAddHidden(false)} />
      </div>
     <Dialog hidden={isAddHidden}
        onDismiss={()=>setIsAddHidden(true)}
        dialogContentProps={{
          title:'Add Item',
          type:DialogType.normal
        }}>
<div>
          <TextField
      label='Name'
      value={newName}
      onChange={handleName}
      />
         <TextField
      label='Email'
      value={newEmail}
      onChange={handleEmail}
      />
</div>
<DialogFooter>
  <PrimaryButton
          onClick={()=>_createListItems()}
          text='Save'
          />
          <DefaultButton
          onClick={()=>setIsAddHidden(true)}
          text='Cancel'
          />
        </DialogFooter>

     </Dialog>
    </div>
    </>
  )
}
export default CrudOperation;