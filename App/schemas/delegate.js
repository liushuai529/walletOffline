export function findDelegateSelfCurrent(goods_id,currency_id,skip, limit) {

    return {
        skip,
        limit,
        goods_id,
        currency_id,
        where: {
            status:["waiting","dealing"]
        }
    }
}

export function findDelegateSelfHistory(goods_id,currency_id,skip, limit) {

    return {
        skip,
        limit,
        goods_id,
        currency_id,
        where: {
            status:["complete", "cancel", "canceling"]
        },
    }
}
