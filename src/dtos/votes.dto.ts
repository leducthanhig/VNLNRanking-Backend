import { ArrayMaxSize, ArrayUnique, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

class Feedback {
    @IsString()
    @MinLength(0)
    @MaxLength(500)
    topic: string;

    @IsString()
    @MinLength(0)
    @MaxLength(500)
    content: string;

    @IsString()
    @MinLength(0)
    @MaxLength(500)
    title: string;

    @IsString()
    @MinLength(0)
    @MaxLength(500)
    publisher: string;
}

export class CreateVoteDto {
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Max(215, { each: true })
    @ArrayUnique()
    @ArrayMaxSize(10)
    favoriteRanobe: number[];

    @IsInt({ each: true })
    @Min(1, { each: true })
    @Max(154, { each: true })
    @ArrayUnique()
    @ArrayMaxSize(10)
    favoriteIllustrator: number[];

    @IsInt({ each: true })
    @Min(1, { each: true })
    @Max(17, { each: true })
    @ArrayUnique()
    @ArrayMaxSize(3)
    favoritePublisher: number[];

    @ValidateNested()
    feedback: Feedback;

    @IsString()
    @IsNotEmpty()
    token: string;
}