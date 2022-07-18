import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductData {
  @ApiPropertyOptional({
    description: 'Whether the product is currently available for purchase. Defaults to `true`.'
  })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'The identifier for the product. Must be unique. If not provided, an identifier will be randomly generated.'
  })
  id?: string;
  
  @ApiPropertyOptional({
    description: 'Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.'
  })
  metadata?: {[name: string]: string | number | null};

  @ApiProperty({
    description: `The product's name, meant to be displayable to the customer.`
  })
  name: string;

  /**
   * 
   *
   * 
   */
  @ApiPropertyOptional({
    description: `
      An arbitrary string to be displayed on your customer's credit card or bank statement. While most banks display this information consistently, some may display it incorrectly or not at all.
      This may be up to 22 characters. The statement description may not include \`<\`, \`>\`, \`\\\`, \`"\`, \`'\` characters, and will appear on your customer's statement in capital letters. Non-ASCII characters are automatically stripped.
    `
  })
  statementDescriptor?: string;

  @ApiPropertyOptional({
    description: 'A [tax code](https://stripe.com/docs/tax/tax-categories) ID.'
  })
  taxCode?: string;

  @ApiPropertyOptional({
    description: `A label that represents units of this product in Stripe and on customers' receipts and invoices. When set, this will be included in associated invoice line item descriptions.`
  })
  unitLabel?: string;
}