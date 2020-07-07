export function findInvitation(skip, limit, id, levelName) {
  let graphqlMark = `mark: {
    like: "-${id}-%"
  }`;
  if (levelName === 'level0') {
    graphqlMark = `mark: "-${id}-"`;
  }

  return `{
    find_invitation(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
          or: [
            {
              ${graphqlMark}
            },
            {
              parent_id: ${id}
            },
            {
              super_top_id: ${id},
              top_id: 0
            }
          ]
        },
        order: "-createdAt"
    ){
        id,
        createdAt,
        mark,
        parent{
          id
        }
        sub{
            id,
            name,
            mobile,
            email,
            prefixNo,
            recommendId,
            levelName
        },
    }
}`
}

export function findRebatestat(skip, limit, id, tokenId) {
  return `{
    find_rebatestat(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
            user_id: ${id},
            token_id: ${tokenId}
        },
        order: "-createdAt"
    ){
        id
        datetime,
        rebateFees,
        createdAt,
        user{
            id
            name
            mobile
        }
        token{
            id
            name
        }
    }
  }`
}

export function findRebates(skip, limit, id, tokenId, datetime) {
  if (tokenId == 2) return findRebatesBTC(skip, limit, id, tokenId, datetime);
  return `{
    find_rebates(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
          to_user_id: "${id}",
          datetime: "${datetime}",
          duration: "day",
        },
        order: "-createdAt"
    ){
        id
        datetime,
        rebateFees,
        createdAt,
        from_user{
            id
            name
            mobile
            email
            prefixNo
            recommendId
            levelName
        }
        token{
            id
            name
        }
    }
  }`
}

export function findRebatesBTC(skip, limit, id, tokenId, datetime) {
  let firstTime = getCurrentMonthFirst(datetime);
  let lastTime = getCurrentMonthLast(datetime);
  return `{
    find_rebates(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
            to_user_id: "${id}",
            datetime: {between: ["${firstTime}", "${lastTime}"]},
            duration: "month"
        },
        order: "-createdAt"
    ){
        id
        datetime,
        rebateFees,
        createdAt,
        from_user{
            id
            name
            mobile
            email
            prefixNo
            recommendId
            levelName
        }
        token{
            id
            name
        }
    }
  }`
}

function getCurrentMonthFirst(datetime) {
  let date = new Date(datetime);
  return date.toJSON();
}

function getCurrentMonthLast(datetime) {
  var date = new Date(datetime);
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  return nextMonthFirstDay.toJSON();
}