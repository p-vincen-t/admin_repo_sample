import { Upload } from 'models/Common';
// quantity measure piece
export const PIECE = "piece";
// quantity measure box, a box can have many pieces
export const BOX = "box";
// quantity measure carton, a carton can have many boxes
export const CARTON = "carton";
/**
The quantities for a given sku are the units and measurement spec in which 
one scale maps to the next.
Each sku must have a base quantity on which conversions can refer to.
Now consecutive quantity can base on the the primary quantity or based on 
another preliminary quantity that bases on the primary quantity
An example is
  * The primary quantity (units=1, target=piece, target_id=TR890, unit_type=null) -> id=1
  * The preliminary quantity (units=20, target=box, target_id=TR900, unit_type=1) -> id=2
  * The derived quantity (units=5, target=carton, target_id=TR1200, unit_type=2) -> id=3
From the above example
We can say for every carton, there are 5 boxes in a carton. But not 5 pieces in a 
carton since the quantity id 3 is derived from id 2 and not 1 (check unit type)
We can also say that there are 20 pieces in a box since quantity id 2 for box is 
derived from unit type 1 which is of target piece
 
*/
export type Quantity =  {
    // the id of the quantity
    id: string
    // the measured number of this quantity
    units: number
    // the target that this quantity describes, might be pieces, box, cartons
    target: string
    // the target id of the target
    target_id: string
    // this quantity must reference another quantity
    unit_type: string
    // toggle state of this quantity
    active: boolean
}
/**
The sku price list is a list of prices that this particular sku can be traded in the market
A price info, should target a given end consumer, here the end consumer broadly 
defined to mean anything from event,
customer, quantity, and even locality.
The price info is in terms of credits (refer to payment doc for more illustration)
An example (amount=200, currency = Credits, target = quantity, target_id = 3,
Description = ‘some info about this pricing’)
 */
export type Pricing = {
    // the id of the price info
    id: string
    // the amount of this pricing
    amount:number
    // the currency of this pricing
    currency: string
    // the target of the price, might be event, customer, locality, quantity
    target: string
    // the target id of the target
    target_id: string
    // toggle state of this pricing
    active: boolean    
}
/**
The SKU is the definitive product information. It entails the product code, name , 
description, multiple photos as well as pricing and quantity lists. 
  * An example (SupaLoaf 400g, code=SP900S, code_id = id456, description=some description, photos=many)
The code_id is the same for all the skus belonging to the same registar, while code is 
unique in that context. The photos are all the photos of the same product that should be visible to the customer. 
Each sku has a list of price list. 

 */
export type ProductSKU = {
    // the id of the sku
    id: string
    // the name of the sku
    name: string
    // the code of this sku scoped to the registrar
    code: string
    // the if the code
    code_id: string
    // description of the sku
    description: string
    // all the photos for this sku
    photos: Upload[]
    // all the price lists of the same sku
    price_list: Pricing[]
    // all the quantities that this sku can be presented in
    quantity_list: Quantity[]
    // toggle state for this sku
    active: boolean
}
/**
A catalog is a library of product information, A product belongs to the registrar, 
here the main registrar is the system account. A product has the following info in abstract
The information of the registrar, preferably the user that added it to the system. 
This will aid in information protection, it also has the information about itself, 
name, description, category and active status
Additionally, a product has multiple sku and each sku has multiple 
quantities and price information.
An example (Supaloaf Bread, ‘some description of bread, category=(Bread)’)
 */
export default class Product  {
    // the id of this product
    id: string
    // the name of the product
    name: string
    // the description of the product
    description: string
    // the brand of the product, alternatively reference as category
    category: string
    // toggle state of the product
    active: boolean
}
