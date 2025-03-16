import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class VotingPeriod extends TimeStamps {
  @prop({ type: Number, required: true })
  public _id!: number;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public startDate!: Date;

  @prop({ required: true })
  public endDate!: Date;

  @prop({ default: true })
  public isActive!: boolean;
}

const VotingPeriodModel = getModelForClass(VotingPeriod);

export default VotingPeriodModel;
