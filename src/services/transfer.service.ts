const model = require("../models/index");
const sequelize = require("../config/db.config");
import { getPagination, getPagingData } from "../helpers/pagination";
import { Op } from "sequelize";

export const getTransfertStatusByCode = async (code: string) => {
  try {
    return await model.TransferStatus.findOne({
      where: {transfer_status_code: code}
    })
  } catch (error: any) {
    console.log("\n transfer.service::getTransfertStatusByCode");
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
    console.log("\n transfer.service::createTransfer");
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

  const page = (params.page && +params.page > 1) ? +params.page - 1 : 0;
  const size = params.size ? params.size : 10;
  const { limit, offset } = getPagination(page, +size);
  try {
    const data = await model.Transfer.findAndCountAll(
      {
        attributes: [ "transfer_id", "transfer_uuid", "transfer_quantity", "createdAt", "updatedAt" ],
        include: [
          {
            model: model.TransferStatus,
            attributes: ["transfer_status_id", "transfer_status_uuid", "transfer_status_code", "transfer_status_label"],
            where: statusCondition
          },
          {
            model: model.Product,
            attributes: ["product_id", "product_uuid", "code", "label"],
            where: productCondition
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
    )
    return getPagingData(data, +page, 10);
  } catch (error: any) {
    console.log("\n transfer.service::getAllTransfer");
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
    console.log("\n transfer.service::getTransfer");
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
    console.log("\n transfer.service::getTransferByUuidByShop");
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
    console.log("\n transfer.service::getAttributeSerializationTransfer");
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
    console.log("\n transfer.service::updateAttributeSerializationTransfer");
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
    console.log("\n transfer.service::updateTransfer");
    throw new Error(error);
  }
}