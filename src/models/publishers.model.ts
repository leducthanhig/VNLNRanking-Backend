import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Publisher extends TimeStamps {
    @prop({ required: true })
    _id!: string

    @prop({ required: true })
    publisherName!: string
}

const PublisherModel = getModelForClass(Publisher);

export default PublisherModel