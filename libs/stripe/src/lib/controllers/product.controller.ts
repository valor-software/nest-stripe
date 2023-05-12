import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  BaseDataResponse,
  CreateProductDto,
  ProductDto,
  ProductResponse,
  UpdateProductDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Product')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/product')
export class ProductController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: ProductResponse })
  @Post('create')
  createProduct(@Body() dto: CreateProductDto): Promise<ProductResponse> {
    return this.stripeService.createProduct(dto);
  }

  @ApiResponse({ type: ProductResponse })
  @Post(':productId/update')
  updateProduct(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto
  ): Promise<ProductResponse> {
    return this.stripeService.updateProduct(productId, dto);
  }

  @ApiResponse({ type: ProductResponse })
  @Delete(':productId/delete')
  deleteProduct(@Param('productId') productId: string): Promise<ProductResponse> {
    return this.stripeService.deleteProduct(productId);
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get('')
  productList(): Promise<BaseDataResponse<ProductDto[]>> {
    return this.stripeService.getProductList();
  }

  @ApiResponse({ type: BaseDataResponse<ProductDto> })
  @ApiTags('Stripe: Product')
  @Get(':productId')
  productById(
    @Param('productId') productId: string
  ): Promise<BaseDataResponse<ProductDto>> {
    return this.stripeService.getProductById(productId);
  }

}