## TODO: Pisahkan coding (login, chatbot, cart/checkout, kontak/pemesanan, testimoni)

- [ ] Bikin folder `js/` dan file modular: `store.js`, `products.js`, `auth.js`, `cart.js`, `chatbot.js`, `main.js`.
- [ ] Pindahkan logic dari `script.js` ke modul-modul tersebut (tanpa mengubah perilaku).
- [ ] Update `index.html` agar memakai `<script type="module" src="js/main.js">`.
- [ ] Jadikan `script.js` sebagai entrypoint legacy atau hapus isi (opsi: biarkan tapi tidak dipakai).
- [ ] Pastikan tombol login/logout, gating checkout, rendering produk, cart ringkasan, WhatsApp checkout, dan chatbot tetap berfungsi.
- [ ] Test manual: register→logout→login→add-to-cart→checkout, dan beberapa pertanyaan chatbot.

