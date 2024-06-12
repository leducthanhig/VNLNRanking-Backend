import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
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

    public static async getLeaderboard(this: ReturnModelType<typeof Vote>) {
        const favoriteRanobes = await this.aggregate([
            {
                '$unwind': {
                    'path': '$favoriteRanobe'
                }
            }, {
                '$group': {
                    '_id': '$favoriteRanobe',
                    'count': {
                        '$sum': 1
                    }
                }
            }, {
                '$lookup': {
                    'from': 'ranobes',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'ranobe'
                }
            }, {
                '$sort': {
                    'count': -1
                }
            }, {
                '$addFields': {
                    'ranobe': {
                        '$first': '$ranobe'
                    }
                }
            }
        ])
        const favoriteIllustrators = await this.aggregate([
            {
                '$unwind': {
                    'path': '$favoriteIllustrator'
                }
            }, {
                '$group': {
                    '_id': '$favoriteIllustrator',
                    'count': {
                        '$sum': 1
                    }
                }
            }, {
                '$lookup': {
                    'from': 'illustrators',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'illustrator'
                }
            }, {
                '$sort': {
                    'count': -1
                }
            }, {
                '$addFields': {
                    'illustrator': {
                        '$first': '$illustrator'
                    }
                }
            }
        ])
        const favoritePublishers = await this.aggregate([
            {
                '$unwind': {
                    'path': '$favoritePublisher'
                }
            }, {
                '$group': {
                    '_id': '$favoritePublisher',
                    'count': {
                        '$sum': 1
                    }
                }
            }, {
                '$lookup': {
                    'from': 'publishers',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'publisher'
                }
            }, {
                '$sort': {
                    'count': -1
                }
            }, {
                '$addFields': {
                    'publisher': {
                        '$first': '$publisher'
                    }
                }
            }
        ])
        const count = await this.countDocuments({})

        return { favoriteRanobes, favoriteIllustrators, favoritePublishers, count }
    }
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