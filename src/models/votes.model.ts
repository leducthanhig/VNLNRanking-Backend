import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose, { PipelineStage } from 'mongoose';

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
    const favoriteRanobes = await this.aggregate(getRanobeAggregate('favoriteRanobe'));
    const favoriteOneshots = await this.aggregate(getRanobeAggregate('favoriteOneshot'));
    const favoriteRookies = await this.aggregate(getRanobeAggregate('favoriteRookie'));

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

    return { favoriteRanobes, favoritePublishers, favoriteOneshots, favoriteRookies, count };
  }
}

const VoteModel = getModelForClass(Vote);

export default VoteModel;

const getRanobeAggregate = (field: string): PipelineStage[] => [
  {
    $unwind: {
      path: `$${field}`,
    },
  },
  {
    $group: {
      _id: `$${field}`,
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
];

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
