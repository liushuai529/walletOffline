import { common } from "../constants/common";

export function findPaymentList(skip, limit, data, startDate, endDate) {
    if (startDate && endDate) {
        return `{
    find_payment(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
          user_id: ${data.id},
          createdAt: {
                between: ["${common.fetchBeginTime(startDate).toISOString()}", "${common.fetchEndTime(endDate).toISOString()}"]
            }
        },
        order: "-createdAt"
    ){
        id
        fromaddr
        toaddr
        type
        status
        amount
        reachtime
        createdAt
        profit
        bonus
        token{
          id
          name
        }
    }
}`;
    } else if (startDate) {
        return `{
    find_payment(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
          user_id: ${data.id},
          createdAt: {
                gte: "${common.fetchBeginTime(startDate).toISOString()}"
            }
        },
        order: "-createdAt"
    ){
        id
        fromaddr
        toaddr
        type
        status
        amount
        reachtime
        createdAt
        profit
        bonus
        token{
          id
          name
        }
    }
}`;
    } else if (endDate) {
        return `{
    find_payment(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
          user_id: ${data.id},
          createdAt: {
                between: ["", "${common.fetchEndTime(endDate).toISOString()}"]
            }
        },
        order: "-createdAt"
    ){
        id
        fromaddr
        toaddr
        type
        status
        amount
        reachtime
        createdAt
        profit
        bonus
        token{
          id
          name
        }
    }
}`;
    }
    return `{
    find_payment(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
          user_id: ${data.id}
        },
        order: "-createdAt"
    ){
        id
        fromaddr
        toaddr
        type
        status
        amount
        reachtime
        createdAt
        profit
        bonus
        token{
          id
          name
        }
    }
}`;
}
