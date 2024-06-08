import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';

class Feedback {
    @prop()
    public topic?: string

    @prop()
    public content?: string

    @prop()
    public title?: string

    @prop()
    public publisher?: string
}

class Vote extends TimeStamps {
    @prop({ required: true })
    public ip!: string

    @prop({ type: Number, required: true, default: [] })
    public favoriteRanobe!: mongoose.Types.Array<number>;

    @prop({ type: Number, required: true, default: [] })
    public favoriteIllustrator!: mongoose.Types.Array<number>;

    @prop({ type: Number, required: true, default: [] })
    public favoritePublisher!: mongoose.Types.Array<number>;

    @prop({ required: true })
    public feedback!: Feedback
}

const VoteModel = getModelForClass(Vote);

export default VoteModel

const body = {
    favoriteRanobe: [1, 2, 3],
    favoriteIllustrator: [1, 2, 3],
    favoritePublisher: [1, 2, 3],
    feedback: {
        topic: "",
        content: "",
        title: "",
        publisher: "",
    },
    token: "eJy...",
}