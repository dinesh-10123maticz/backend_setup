import mongoose from "mongoose";
/**
 * 
 * @param {mongo URI for connection} MongoURI 
 */
const mongoCon = async (MongoURI) => {
        mongoose.set('strictQuery', false);
        mongoose.connect(
            MongoURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true

            }
        ).then(() => console.log('Mongo DB Connected Successfully', MongoURI))
            .catch((err) => {
                console.log("mongo connect err",err);
            });
}

export default mongoCon;