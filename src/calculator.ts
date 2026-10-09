export const defaults = {
  tickets:80, ticketYen:850, manualLot:false, lotYen:68000, lots:1, batch:1, exchange:850,
  shipping:'air' as 'air'|'sea', domestic:22355, air:60000, sea:25000, manualFreight:false, freightTotal:60000,
  clearance:30000, shippingOther:0, dutyRate:8, importVatRate:10, salesVatRate:10,
  feeRate:6.4, importCredit:true, feeIncludesVat:true, feeCredit:false, feeVatRate:10,
  localDelivery:0, other:0, manualCustoms:false, customsValue:660355, price:16000,
};
export type Settings = typeof defaults;
// All arithmetic retains precision; only displayed KRW amounts are rounded to whole won.
export function calculate(s:Settings, price=s.price) {
  const shipments=Math.ceil(s.lots/s.batch);
  const purchase=(s.manualLot?s.lotYen:s.tickets*s.ticketYen)*s.lots*s.exchange/100;
  const domestic=s.domestic*s.lots;
  const freight=s.manualFreight?s.freightTotal:s[s.shipping]*shipments;
  const customs=s.manualCustoms?s.customsValue:purchase+domestic+freight;
  const duty=customs*s.dutyRate/100;
  const importVat=(customs+duty)*s.importVatRate/100;
  const importCost=s.importCredit?0:importVat;
  const clearance=s.clearance*shipments;
  const gross=s.tickets*s.lots*price;
  const net=gross/(1+s.salesVatRate/100);
  const feeBase=gross*s.feeRate/100;
  const feeNet=s.feeIncludesVat?feeBase/(1+s.feeVatRate/100):feeBase;
  const feePaid=s.feeIncludesVat?feeBase:feeBase*(1+s.feeVatRate/100);
  const feeVat=feePaid-feeNet;
  const feeCost=s.feeCredit?feeNet:feePaid;
  const other=s.shippingOther+s.localDelivery+s.other;
  const cost=purchase+domestic+freight+duty+importCost+clearance+feeCost+other;
  const profit=net-cost;
  return {shipments,purchase,domestic,freight,customs,duty,importVat,importCost,clearance,gross,net,salesVat:gross-net,feePaid,feeVat,feeCost,other,cost,profit,margin:net===0?0:profit/net*100,lotProfit:profit/s.lots};
}
export const prices=Array.from({length:19},(_,i)=>10000+i*500);
