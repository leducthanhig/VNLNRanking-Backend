import { ONESHOT_RANOBE_IDS, ROOKIE_RANOBE_IDS } from '@/config';
import { ArrayMaxSize, ArrayUnique, IsIn, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

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

class UserInfo {
  @IsString()
  @IsIn(['male', 'female'])
  gender: string;

  @IsInt()
  @Min(0)
  @Max(100)
  age: number;
}

export class CreateVoteDto {
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(219, { each: true })
  @ArrayUnique()
  @ArrayMaxSize(10)
  favoriteRanobe: number[];

  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(219, { each: true })
  @IsIn(ONESHOT_RANOBE_IDS, { each: true })
  @ArrayUnique()
  @ArrayMaxSize(5)
  favoriteOneshot: number[];

  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(219, { each: true })
  @IsIn(ROOKIE_RANOBE_IDS, { each: true })
  @ArrayUnique()
  @ArrayMaxSize(3)
  favoriteRookie: number[];

  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(17, { each: true })
  @ArrayUnique()
  @ArrayMaxSize(3)
  favoritePublisher: number[];

  @ValidateNested()
  feedback: Feedback;

  @ValidateNested()
  userInfo: UserInfo;

  @IsString()
  @IsNotEmpty()
  token: string;
}
