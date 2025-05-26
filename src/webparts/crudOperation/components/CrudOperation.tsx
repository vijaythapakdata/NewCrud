import * as React from 'react';
// import styles from './CrudOperation.module.scss';
import type { ICrudOperationProps } from './ICrudOperationProps';
import {spfi,SPFI} from "@pnp/sp/presets/all"
import {SPFx} from "@pnp/sp/presets/all";

interface ICrudOperationState{
  Title:string;
  Email:string;
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
  email:each.Email,
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
  return(
    <>
    </>
  )
}
export default CrudOperation;