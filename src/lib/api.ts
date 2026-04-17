export const API = {
  getStats: () => fetch('/api/stats').then(res => res.json()),
  getCustomers: () => fetch('/api/customers').then(res => res.json()),
  addCustomer: (data: any) => fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  getDeals: () => fetch('/api/deals').then(res => res.json()),
  addDeal: (data: any) => fetch('/api/deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateDealStage: (id: number, stage: string) => fetch(`/api/deals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage })
  }).then(res => res.json()),
  getProducts: () => fetch('/api/products').then(res => res.json()),
  addProduct: (data: any) => fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
};
