import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { response } from 'express';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }

  @Get('suggestions')
  async suggestions(
    @Query('q') name: string,
    @Query('coordinate') coordinate: string,
    @Query('radius') radius: number,
    @Query('sort') sort: string,
  ) {

    if (coordinate && !radius || !coordinate && radius) {
      return response.status(403).json({
        message: 'coordinate and radius should be both sent'
      })
    }
    if (coordinate) coordinate = JSON.parse(coordinate);
    if(coordinate && typeof coordinate != 'object') return {

    }
    const lat = coordinate ? +coordinate[0] : 0
    const long =  coordinate ? +coordinate[1] : 0
    const  result =  await this.citiesService.suggestions(name, lat, long, radius, sort);
    return { 
      result
    }
  }

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(+id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citiesService.remove(+id);
  }
}
