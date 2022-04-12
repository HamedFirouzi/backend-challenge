import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import {City, CityDocument} from './schemas/cities'
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>) {}

  public async suggestions(
    name: string,
    lat: number,
    long: number,
    radius: number,
    sort: string
  ) {
    const pipelineStages = []
    const matchObjct = { $match: {} }

    // 1. find cities in a certain radius of coordinates

    pipelineStages.push({
      near: { type: 'Point', coordinates: [ lat, long ] },
      distanceField: 'distance',
      maxDistance: radius,
      spherical: true
    })


    // 2. Match names by q
    if (name) matchObjct['$match']['name'] = { '$regex': name, '$options': 'i' }
    pipelineStages.push(matchObjct)


    // //last: return required fields only and add sort
    pipelineStages.push({
      $project: {
        "name": 1,
        "lat": 1,
        "long": 1,
        "distance": 1
      }
    })
    if (sort === 'name') pipelineStages.push({ $sort: { name: 1 } })
    else if (sort === 'distance') pipelineStages.push({ $sort: { distance: 1 } })
    else if (sort) return {message: 'invalid sort'}


    const resultObject = await this.cityModel.aggregate(pipelineStages)

    return {
      count: resultObject.length,
      resultObject
    }
  }


  create(createCityDto: CreateCityDto) {
    return 'This action adds a new city';
  }

  findAll() {
    return `This action returns all cities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
