export default function findOpenOrders({ id, goodId, currencyId }) {
    return {
        limit: 2,        	    //查询限制数量。
        goods_id: goodId,		//指定交易物品ID
        currency_id: currencyId,  	//指定交易市场ID  
        classify:   "current",
    }
}
