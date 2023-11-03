
const initialstates={
    save_data:[],

}
export default function Setsavedata(state=initialstates,action){
    
    switch (action.type){
        case 'Set_save_data' :
            return {
                save_data:action.payload
            };
        case 'Create_save_data' :
            return {
                save_data:[...state.save_data,action.payload]
            };
        case 'Delete_save_data' :
            return {
                
                save_data:state.save_data.filter((u)=>u.prod_id !==action.payload.prod_id)
            };
        case 'Update_save_data' :
            return {
                
                save_data:state.save_data.map((u)=>{
                    return u.product!==action.payload.product ? u :action.payload   
                })
            };
            
        default:
            return{
                ...state
            };
            
    }
}