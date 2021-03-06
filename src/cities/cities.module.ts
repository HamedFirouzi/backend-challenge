import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City, CitySchema } from './schemas/cities';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CitiesController],
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/challenge'),
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }])
  ],
  providers: [CitiesService], 
})
export class CitiesModule {}
