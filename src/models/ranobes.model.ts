import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Ranobe extends TimeStamps {
  @prop({ required: true })
  _id!: string;

  @prop({ required: true })
  seriesName!: string;

  @prop({ required: true })
  publisherName!: string;

  @prop({ required: true })
  coverUrl!: string;
}

const RanobeModel = getModelForClass(Ranobe);

export default RanobeModel;
