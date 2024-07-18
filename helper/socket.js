export const socket = async(io,app)=>{
    io.on('connection',(socket)=>{
        console.log(`socket connected id ${socket.id}`);
        app.set('socket',socket)
        app.set('io',io)
      })
}