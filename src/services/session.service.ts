const model = require("../models/index");

export const startSession = async (cash: number, user: number, shop: number) => {
  try {
    const data = {
      cash_float: cash,
      fk_user_id: user,
      is_started: true,
      fk_shop_id: shop
    }
    return await model.Session.create(data)
  } catch (error: any) {
    throw new Error(error);
  }
}

export const endSession = async (amount: number, sessionUuid: string) => {
  const currentdate = new Date(); 
  const datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  try {
    const data = {
      session_amount: amount,
      end_date: datetime,
      is_started: false
    }
    return await model.Session.update(
      data,
      {
        where: {
          session_uuid: sessionUuid
        }
      }
    ).then(async() => {return await sessionByUuid(sessionUuid)});
  } catch (error: any) {
    throw new Error(error);
  }
}

export const sessionByUuid = async (uuid: string) => {
  try {
    return await model.Session.findOne({
      include: [
        {model: model.User},
        {model: model.Shop}
      ],
      where: { session_uuid: uuid }
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

export const userSession = async (userId: string) => {
  try {
    return await model.Session.findOne({
      where: { 
        fk_user_id: userId ,
        is_started: 1
      }
    });
  } catch (error: any) {
    throw new Error(error);
  }
}