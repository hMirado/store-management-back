const model = require("../models/index");
const sequelize = require("../config/db.config");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
import { Op } from "sequelize";
import { generateCodeWithDate } from "../helpers/helper";
import { getProductByUuid } from "./product.service";
import { updateSerializationTransfer, getSerializationByGroup } from "./serialization.service";
import { getStockByProductShop, createStockMovment } from "./stock.service";
import { getStockMovmentTypeByMovment } from "./stock-movment-type.service";

export const getTransfertStatusByCode = async (code: string) => {
  try {
    return await model.TransferStatus.findOne({
      where: {transfer_status_code: code}
    })
  } catch (error: any) {
    console.log("\n transfer.service::getTransfertStatusByCode", error);
    throw new Error(error);
  }
}

export const createTransfer = async (values: typeof model.Transfer, _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Transfer.create(
      values,
      { transaction: _transaction }
    )
  } catch (error: any) {
    console.log("\n transfer.service::createTransfer", error);
    throw new Error(error);
  }
}

export const getAllTransfer = async (params: any) => {
  let conditions: any = {};
  let productCondition: any = {}
  let statusCondition: any = {}
  if (params['keyword']) { 
    productCondition[Op.or] = [
      sequelize.where(sequelize.col('label'), { [Op.like]: `%${params['keyword']}%`}),
      sequelize.where(sequelize.col('code'), { [Op.like]: `%${params['keyword']}%`}),
    ]
  }
  if (params['status']) statusCondition['transfer_status_code'] = params['status']
  if (params['date']) conditions['updatedAt'] = {[Op.startsWith]: params['date']};

  if (params['currentUser']) {
    if (params['user']) {
      conditions[Op.or] = [
        {
          [Op.and]: [
            sequelize.where(sequelize.col('user_sender.user_uuid'), { [Op.eq]: params['currentUser']}),
            sequelize.where(sequelize.col('user_receiver.user_uuid'), { [Op.eq]: params['user']}),
          ],
          [Op.and]: [
            sequelize.where(sequelize.col('user_sender.user_uuid'), { [Op.eq]: params['user']}),
            sequelize.where(sequelize.col('user_receiver.user_uuid'), { [Op.eq]: params['currentUser']}),
          ]
        }
      ]
    } else {
      conditions[Op.or] = [
        sequelize.where(sequelize.col('user_sender.user_uuid'), { [Op.eq]: params['currentUser']}),
        sequelize.where(sequelize.col('user_receiver.user_uuid'), { [Op.eq]: params['currentUser']}),
      ]
    }
  } else {
    if (params['user']) {
      conditions[Op.or] = [
        sequelize.where(sequelize.col('user_sender.user_uuid'), { [Op.eq]: params['user']}),
        sequelize.where(sequelize.col('user_receiver.user_uuid'), { [Op.eq]: params['user']}),
      ]
    }
  }
  
  if (params['currentShop']) {
    if (params['shop']) {
      conditions[Op.or] = {
        [Op.and]: [
          sequelize.where(sequelize.col('shop_sender.shop_uuid'), { [Op.eq]: params['currentShop']}),
          sequelize.where(sequelize.col('shop_receiver.shop_uuid'), { [Op.eq]: params['shop']}),
        ],
        [Op.and]: [
          sequelize.where(sequelize.col('shop_sender.shop_uuid'), { [Op.eq]: params['shop']}),
          sequelize.where(sequelize.col('shop_receiver.shop_uuid'), { [Op.eq]: params['currentShop']}),
        ]
      }
    } else {
      conditions[Op.or] = [
        sequelize.where(sequelize.col('shop_sender.shop_uuid'), { [Op.eq]: params['currentShop']}),
        sequelize.where(sequelize.col('shop_receiver.shop_uuid'), { [Op.eq]: params['currentShop']})
      ]
    }
  } else {
    if (params['shop']) {
      conditions[Op.or] = [
        sequelize.where(sequelize.col('shop_sender.shop_uuid'), { [Op.eq]: params['shop']}),
        sequelize.where(sequelize.col('shop_receiver.shop_uuid'), { [Op.eq]: params['shop']}),
      ]
    }
  }


  
  try {
    const page = (params.page && +params.page > 1) ? +params.page - 1 : 0;
    const size = params.size ? params.size : 10;
    const { limit, offset } = getPagination(page, +size);  console.log("\npage", page);
    const transfers: typeof model.Transfer[] =  await model.Transfer.findAndCountAll(
      {
        attributes: ['transfer_id', 'transfer_uuid', 'transfer_code', 'createdAt', 'updatedAt'],
        include: [
          {
            model: model.TransferStatus,
            attributes: ["transfer_status_id", "transfer_status_uuid", "transfer_status_code", "transfer_status_label"],
            where: statusCondition
          },
          {
            model: model.User,
            as: 'user_sender',
            attributes: ["user_id", "user_uuid", "first_name", "last_name"]
          },
          {
            model: model.User,
            as: 'user_receiver',
            attributes: ["user_id", "user_uuid", "first_name", "last_name"]
          },
          {
            model: model.Shop,
            as: 'shop_sender',
            attributes: ["shop_id", "shop_uuid", "shop_name"]
          },
          {
            model: model.Shop,
            as: 'shop_receiver',
            attributes: ["shop_id", "shop_uuid", "shop_name"]
          }
        ],
        where: conditions,
        offset,
        limit,
        order: [
          ['updatedAt', 'DESC']
        ],
      }
    );
    
    return getPagingData(transfers, +page, 10);
  } catch (error: any) {
    console.log("\n transfer.service::getAllTransfer", error);
    throw new Error(error);
  }
}

export const getTransfer = async (uuid: string) => {
  try {
    return await model.Transfer.findOne(
      {
        include: [model.TransferStatus, model.Product],
        where: {
          transfer_uuid: uuid
        }
      }
    )
  } catch (error: any) {
    console.log("\n transfer.service::getTransfer", error);
    throw new Error(error);
  }
}

export const getTransferByUuidByShop = async (uuid: string, shopId: number, inProgress: boolean) => {
  try {
    const product = await model.Product.findOne(
      {
        include: {
          model: model.Transfer,
          where: {
            transfer_uuid: uuid
          }
        }
      }
    )

    if (product.is_serializable) {
      return transferProductWithSerialization(uuid, shopId, inProgress);
    } else {
      return transferProductWithOutSerialization(uuid, shopId, inProgress);
    }
  } catch (error: any) {
    console.log("\n transfer.service::getTransferByUuidByShop", error);
    throw new Error(error);
  }
}

const transferProductWithSerialization = async (uuid: string, shopId: number, inProgress: boolean) => {
  return await model.Transfer.findOne(
    {
      attributes: [ "transfer_id", "transfer_uuid", "transfer_quantity", "transfer_commentary", "createdAt", "updatedAt" ],
      include: [
        {
          model: model.Product,
          include: {
            model: model.Serialization,
            include: model.SerializationType,
            where: {
              fk_shop_id: shopId,
              [Op.or]: [
                {
                  isInTransfer: inProgress
                },
                { 
                  updatedAt: {
                    [Op.eq]: sequelize.literal(`(select updatedAt from transfers where transfer_uuid = '${uuid}')`)
                  }
                }
              ]
            }
          }
        },
        {
          model: model.TransferStatus,
          attributes: ["transfer_status_id", "transfer_status_uuid", "transfer_status_code", "transfer_status_label"]
        },
        {
          model: model.User,
          as: 'user_sender',
          attributes: ["user_id", "user_uuid", "first_name", "last_name"]
        },
        {
          model: model.User,
          as: 'user_receiver',
          attributes: ["user_id", "user_uuid", "first_name", "last_name"]
        },
        {
          model: model.Shop,
          as: 'shop_sender',
          attributes: ["shop_id", "shop_uuid", "shop_name"]
        },
        {
          model: model.Shop,
          as: 'shop_receiver',
          attributes: ["shop_id", "shop_uuid", "shop_name"]
        }
      ],
      where: {
        transfer_uuid: uuid
      }
    }
  )
}

const transferProductWithOutSerialization = async (uuid: string, shopId: number, inProgress: boolean) => {
  return await model.Transfer.findOne(
    {
      attributes: [ "transfer_id", "transfer_uuid", "transfer_quantity", "transfer_commentary", "createdAt", "updatedAt" ],
      include: [
        {
          model: model.Product
        },
        {
          model: model.TransferStatus,
          attributes: ["transfer_status_id", "transfer_status_uuid", "transfer_status_code", "transfer_status_label"]
        },
        {
          model: model.User,
          as: 'user_sender',
          attributes: ["user_id", "user_uuid", "first_name", "last_name"]
        },
        {
          model: model.User,
          as: 'user_receiver',
          attributes: ["user_id", "user_uuid", "first_name", "last_name"]
        },
        {
          model: model.Shop,
          as: 'shop_sender',
          attributes: ["shop_id", "shop_uuid", "shop_name"]
        },
        {
          model: model.Shop,
          as: 'shop_receiver',
          attributes: ["shop_id", "shop_uuid", "shop_name"]
        }
      ],
      where: {
        transfer_uuid: uuid
      }
    }
  )
}

export const getAttributeSerializationTransfer = async (shop: number, product: number, isInTransfer: boolean = true) => {
  try {
    return await model.Serialization.findAll({
      attributes: [ "attribute_serialization", "fk_shop_id", "fk_product_id" ],
      where : {
        isInTransfer: isInTransfer,
        fk_product_id: product,
        fk_shop_id: shop,
      },
      group: 'attribute_serialization'
    });
  } catch (error: any) {
    console.log("\n transfer.service::getAttributeSerializationTransfer", error);
    throw new Error(error);
  }
}

export const updateIsInTransferSerializationTransfer = async (shop: number, product: number, value: boolean, isInTransfer: boolean, _transaction: IDBTransaction | any = null) => {
  try {    
    return await model.Serialization.update(
      {
        isInTransfer: value
      },
      {
        where: {
          isInTransfer: isInTransfer,
          fk_product_id: product,
          fk_shop_id: shop,
        },
        returning: true
      },
      {transaction: _transaction}
    )
  } catch (error: any) {
    console.log("\n transfer.service::updateAttributeSerializationTransfer", error);
    throw new Error(error);
  }
}

export const updateTransfer = async (transferId: number, value: any, _transaction: IDBTransaction) => {
  try {
    return await model.Transfer.update(
      value,
      {
        where: {
          transfer_id: transferId,
        },
        returning: true
      },
      {transaction: _transaction}
    );
  } catch (error: any) {
    console.log("\n transfer.service::updateTransfer", error);
    throw new Error(error);
  }
}

export const addTransfer = async (user: number, shopSender: number, shopReceiver: number, req: Request) => {
  const transaction = await sequelize.transaction();
  let newTransfer: any = {};
  try {
    const transferStatus: typeof model.TransfertStatus = await getTransfertStatusByCode('IN_PROGRESS');
    if (!transferStatus) throw new Error('Transfer status not found.');

    // add new transfer
    const transferCode = `${generateCodeWithDate()}/${shopSender}/${shopReceiver}`;
    const transfer: typeof model.Transfer = {
      transfer_code: transferCode,
      transfer_commentary: req.body.commentary || null,
      fk_transfer_status_id: transferStatus.transfer_status_id,
      fk_user_sender: user,
      fk_user_receiver: user,
      fk_shop_sender: shopSender,
      fk_shop_receiver: shopReceiver,
    } 
    const transferCreated = await createTransfer(transfer, transaction);
    newTransfer.transfer = transferCreated;
    const transferId = transferCreated.transfer_id;

    // add product to transfer & update serialization is_in_transfer
    let serializationGroup: string[] = [];
    let transferSerializations: any[] = [];
    let productSerializationQuantity: number = 0;
    let stockUpdateds: any[] = []; 

    let products = await Promise.all(req.body.products.map(async (product: any) => {

      // verify if product is in database
      const _product: typeof model.Product = await getProductByUuid(product.product_uuid);;
      if (!_product) throw new Error('Product not found.');

      // verify if quantity is in stock
      const _stock: typeof model.Stock = await getStockByProductShop(_product.product_id, shopSender);
      if(!_stock) throw new Error('Product doesn\'t in stock.');
      if(_stock && _stock.quantity < product['quantity']) throw new Error('Stock of product is less than quantity');

      // add stock movment and update stock
      const quantity = product['quantity'];
      const stockMovmentType = await getStockMovmentTypeByMovment('OUT-TRANSFER');   
      const stockMovement: typeof model.StockMovment = {
        quantity: quantity,
        fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
        fk_product_id: _product.product_id,
        fk_shop_id: shopSender
      }; 

      const stockUpdated = await createStockMovment([stockMovement], transaction)
      console.log("\nmove", stockUpdated);
      stockUpdateds.push(stockUpdated);

      if (product['is_serializable']) {
        productSerializationQuantity += product['quantity']
        const serialization = await Promise.all(product['serializations'].map(async (serialization: any) => {
         
          // verify if serialization is in database and not in transfer actually
          const _serialization: typeof model.Serialization = await getSerializationByGroup(serialization.group_id);
          if (!_serialization) throw new Error('Serialization not found.');
          if (_serialization.is_in_transfer) throw new Error('Serialization is actually in transfer.');

          transferSerializations.push(
            {
              transfer_id: transferId,
              serialization_id: _serialization.serialization_id
            }
          );
          return serialization.group_id;
        }))
        serializationGroup = [...serializationGroup, ...serialization]
      }

      return {
        transfer_id: transferId,
        product_id: _product.product_id,
        quantity: product['quantity']
      }
    }));

    // add stock updated to response
    newTransfer.stockUpdateds = stockUpdateds;

    if (serializationGroup.length != productSerializationQuantity) {
      throw new Error('Serialization not given.');
    };
    
    newTransfer.products = await model.TransferProduct.bulkCreate(products, { transaction: transaction })
    newTransfer.serialization = await updateSerializationTransfer(serializationGroup, transferId, transaction);
    newTransfer.transferSerialization = await model.TransferSerialization.bulkCreate(transferSerializations, { transaction: transaction })

    await transaction.commit();
    return newTransfer;
  } catch (error: any) {
    await transaction.rollback();
    console.log("\n transfer.service::addTransfer", error);
    throw new Error(error);
  }
}

export const getTransferByUuid = async (uuid: string) => {
  try {
    return model.Transfer.findOne(
      {
        include: [
          {
            model: model.Product
          },
          {
            model: model.Serialization
          },
          {
            model: model.TransferStatus,
            attributes: ["transfer_status_id", "transfer_status_uuid", "transfer_status_code", "transfer_status_label"]
          },
          {
            model: model.User,
            as: 'user_sender',
            attributes: ["user_id", "user_uuid", "first_name", "last_name"]
          },
          {
            model: model.User,
            as: 'user_receiver',
            attributes: ["user_id", "user_uuid", "first_name", "last_name"]
          },
          {
            model: model.Shop,
            as: 'shop_sender',
            attributes: ["shop_id", "shop_uuid", "shop_name"]
          },
          {
            model: model.Shop,
            as: 'shop_receiver',
            attributes: ["shop_id", "shop_uuid", "shop_name"]
          }
        ],
        where: {
          transfer_uuid: uuid
        }
      }
    )
  } catch (error: any) {
    console.log("\n transfer.service::getTransferByUuid", error);
    throw new Error(error);
  }
}
