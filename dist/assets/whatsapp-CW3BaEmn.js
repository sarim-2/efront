function a(e){return(e||"").replace(/[^\d]/g,"")}function l(e,n,r){const t=a(e),i=["Hi! I'd like to order:","",...n.map(o=>{const c=o.salePrice||o.price;return`- ${o.name} x${o.quantity} — $${(c*o.quantity).toFixed(2)}`}),"",`Total: $${r.toFixed(2)}`],s=encodeURIComponent(i.join(`
`));return t?`https://wa.me/${t}?text=${s}`:null}function u(e,n,r){const t=a(e),i=n.salePrice||n.price,s=encodeURIComponent(`Hi! I'd like to order:

- ${n.name} x${r} — $${(i*r).toFixed(2)}`);return t?`https://wa.me/${t}?text=${s}`:null}export{l as a,u as b};
