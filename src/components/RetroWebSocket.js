// import React, { useEffect } from 'react';


import React, { Component } from 'react';

class RetroWebSocket extends Component {
    componentDidMount() {
        // if I don't use the getRoomData() function here, nothing renders on the RoomShow component
        this.props.getRetroData(this.props.id)
        this.props.cableApp.retro = this.props.cableApp.cable.subscriptions.create({
            channel: "RetrosChannel",
            retro: this.props.id
        }, 
        {
            received: (updatedRetro) => {
                console.log("received",updatedRetro)
                this.props.updateApp(updatedRetro)
            }
        })
        console.log(this.props.cableApp)
    }

    render() {
        return (
            <div></div>
        )
    }
}

// const RetroWebSocket =({cableApp,updateApp,id,getRetroData})=> {
//     useEffect(()=>{
//         getRetroData(id)
//         cableApp.retro = 
//         cableApp.cable.subscriptions.create({
//             channel: "RetrosChannel",
//             retro: id
//         },
//         {
//             received : (updatedRetro)=>{
//                 console.log("retroNew",updatedRetro)
//                  updateApp(updatedRetro)
//             }
//         })
//     },[])
    
//         return (
//             <div>

//             </div>
//         );
// }


export default RetroWebSocket;