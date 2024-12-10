import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';

class Feedback {
  @prop()
  public topic?: string;

  @prop()
  public content?: string;

  @prop()
  public title?: string;

  @prop()
  public publisher?: string;
}

class UserInfo {
  @prop({ required: true })
  public gender!: string;

  @prop({ required: true })
  public age!: number;
}

class Vote extends TimeStamps {
  @prop({ required: true })
  public ip!: string;

  @prop()
  public ua?: string;

  @prop({ type: Number, required: true, default: [] })
  public favoriteRanobe!: mongoose.Types.Array<number>;

  @prop({ type: Number, required: true, default: [] })
  public favoriteOneshot!: mongoose.Types.Array<number>;

  @prop({ type: Number, required: true, default: [] })
  public favoriteRookie!: mongoose.Types.Array<number>;

  @prop({ type: Number, required: true, default: [] })
  public favoritePublisher!: mongoose.Types.Array<number>;

  @prop({ required: true })
  public feedback!: Feedback;

  @prop({ required: true })
  public userInfo!: UserInfo;

  public static async getLeaderboard(this: ReturnModelType<typeof Vote>) {
    const favoriteRanobes = await this.aggregate([
      {
        $unwind: {
          path: '$favoriteRanobe',
        },
      },
      {
        $group: {
          _id: '$favoriteRanobe',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'ranobes',
          localField: '_id',
          foreignField: '_id',
          as: 'ranobe',
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $addFields: {
          ranobe: {
            $first: '$ranobe',
          },
        },
      },
    ]);
    const favoriteIllustrators = await this.aggregate([
      {
        $unwind: {
          path: '$favoriteIllustrator',
        },
      },
      {
        $group: {
          _id: '$favoriteIllustrator',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'illustrators',
          localField: '_id',
          foreignField: '_id',
          as: 'illustrator',
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $addFields: {
          illustrator: {
            $first: '$illustrator',
          },
        },
      },
    ]);
    const favoritePublishers = await this.aggregate([
      {
        $unwind: {
          path: '$favoritePublisher',
        },
      },
      {
        $group: {
          _id: '$favoritePublisher',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'publishers',
          localField: '_id',
          foreignField: '_id',
          as: 'publisher',
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $addFields: {
          publisher: {
            $first: '$publisher',
          },
        },
      },
    ]);
    const count = await this.countDocuments({});

    return { favoriteRanobes, favoriteIllustrators, favoritePublishers, count };
  }
}

const VoteModel = getModelForClass(Vote);

export default VoteModel;

const body = {
  favoriteRanobe: [1, 2, 3],
  favoriteOneshot: [17, 22, 38, 39],
  favoriteRookie: [2, 6, 13],
  favoritePublisher: [1, 2, 3],
  feedback: {
    topic: '',
    content: "''",
    title: "''",
    publisher: "''",
  },
  userInfo: {
    gender: 'famale',
    age: 22,
  },
  token: '10000000-aaaa-bbbb-cccc-000000000001',
};
