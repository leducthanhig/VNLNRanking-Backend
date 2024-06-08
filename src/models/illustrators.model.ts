import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Illustrator extends TimeStamps {
    @prop({ required: true })
    _id!: string

    @prop({ required: true })
    name!: string
}

const IllustratorModel = getModelForClass(Illustrator);

export default IllustratorModel