import { IsNotEmpty, IsNumber, IsString, ValidationArguments } from 'class-validator';
import { CustomValidateFn } from 'validation-decorators';

import { CoreDto } from '../../shared/utils/dto/core.dto';
import { ProductService } from '../product.service';
import { app } from '../../../main';


export class CreateProductDto extends CoreDto {
  @CustomValidateFn('unique',
    (value: string, args: ValidationArguments, argsObject) => {
      const productService = app.get(ProductService);
      
      return productService.findByName(value)
        .then((product) => !product)
        .catch(() => true);
    },
    {message: 'Product Name already exists'},
  )
  @IsNotEmpty()
  @IsString()
  public name: string = undefined;
  
  @IsNotEmpty()
  @IsNumber()
  public price: number = undefined;
  
  constructor(protected input: any = {}, currentProduct?) {
    super(currentProduct);
    this.populateFields(input);
  }
}