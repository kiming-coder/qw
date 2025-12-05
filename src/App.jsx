import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaTelegram, FaInstagram, FaServer, FaBolt, FaShieldAlt, FaCreditCard, FaQrcode, FaStar, FaCheckCircle, FaShoppingCart, FaSpinner, FaExclamationTriangle, FaCopy, FaHome, FaBox, FaShoppingBag, FaUser, FaClock, FaUpload, FaReceipt } from "react-icons/fa";

// ==================== HELPER FUNCTIONS ====================
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORDER-${timestamp}-${random}`;
};

// Format WhatsApp message
const formatWhatsAppMessage = (orderData, cartItems) => {
  if (!orderData || !cartItems || cartItems.length === 0) return '';
  
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let message = `Halo Admin, saya telah melakukan pembayaran untuk order berikut:\n\n`;
  message += `📋 *DETAIL ORDER*\n`;
  message += `Order ID: ${orderData.orderId || 'N/A'}\n`;
  message += `Nama: ${orderData.name || 'N/A'}\n`;
  message += `WhatsApp: ${orderData.whatsapp || 'N/A'}\n`;
  message += `Email: ${orderData.email || 'N/A'}\n\n`;
  
  message += `🛒 *ITEM YANG DIPESAN:*\n`;
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.title} (${item.spec || ''})\n`;
    message += `   Jumlah: ${item.quantity} x Rp ${item.price.toLocaleString()}\n`;
    message += `   Subtotal: Rp ${(item.price * item.quantity).toLocaleString()}\n\n`;
  });
  
  message += `💰 *TOTAL PEMBAYARAN:* Rp ${totalPrice.toLocaleString()}\n\n`;
  message += `💳 *Metode Pembayaran:* QRIS Manual\n`;
  message += `📅 *Tanggal Order:* ${new Date().toLocaleString('id-ID')}\n\n`;
  message += `⚠️ *BUKTI PEMBAYARAN TELAH SAYA UPLOAD*\n`;
  message += `Mohon segera proses order saya. Terima kasih!`;
  
  return encodeURIComponent(message);
};

// Format WhatsApp number
const formatWhatsApp = (number) => {
  if (!number) return '';
  let cleaned = number.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

// ==================== NAVBAR ====================
function Navbar({ cartItems }) {
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center py-6 px-8 bg-black/80 backdrop-blur-xl fixed w-full z-50 border-b border-purple-900/50"
    >
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <FaServer className="text-purple-500 text-xl" />
        <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          SEWA BOT & PANEL
        </h1>
      </Link>
      
      <div className="hidden md:flex gap-6 text-sm items-center">
        <Link to="/" className="hover:text-purple-400 transition-colors flex items-center gap-2">
          <FaHome /> Home
        </Link>
        <Link to="/paket" className="hover:text-purple-400 transition-colors flex items-center gap-2">
          <FaBox /> Paket
        </Link>
        <Link to="/cart" className="relative ml-4 flex items-center gap-2 hover:text-purple-400">
          <FaShoppingBag /> Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      
      <Link
        to="/paket"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-[0_0_20px_3px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_5px_rgba(168,85,247,0.6)] transition-all px-4 py-2 rounded-xl font-semibold hidden md:block"
      >
        Order Sekarang
      </Link>
      
      <div className="md:hidden">
        <Link to="/cart" className="relative">
          <FaShoppingBag className="text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </motion.nav>
  );
}

// ==================== HOME ====================
function Home() {
  const ADMIN_WHATSAPP = "6281228010210";
  
  return (
    <section className="relative overflow-hidden pt-32 px-4 md:px-8 text-center flex flex-col items-center">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <div className="inline-block mb-6 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-700/50">
          <span className="text-sm text-purple-300">💳 Pembayaran QRIS Manual</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
          Sewa Bot & Panel Server{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Termurah & Terpercaya
          </span>
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Pembayaran dengan <span className="text-purple-400 font-semibold">QRIS Manual</span>. 
          Upload bukti transfer dan konfirmasi via WhatsApp untuk aktivasi cepat.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/paket"
            className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_25px_4px_rgba(168,85,247,0.5)] hover:from-purple-700 hover:to-pink-700 hover:shadow-[0_0_35px_6px_rgba(168,85,247,0.7)] transition-all px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Mulai Order
          </Link>
          <a
            href={`https://wa.me/${ADMIN_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-purple-600 hover:bg-purple-600/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
          >
            Hubungi Admin
          </a>
        </div>

        {/* QRIS Manual Payment Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10 mb-12">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <FaQrcode className="text-white text-sm" />
          </div>
          <div className="text-left">
            <div className="font-bold">QRIS Manual Payment</div>
            <div className="text-sm text-gray-400">Upload bukti transfer via WhatsApp</div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl">
        {[
          { icon: <FaQrcode />, title: "QRIS Manual", desc: "Bayar via QRIS, upload bukti", color: "from-green-500 to-emerald-500" },
          { icon: <FaBolt />, title: "Proses Instan", desc: "Aktivasi 5 menit setelah konfirmasi", color: "from-yellow-500 to-orange-500" },
          { icon: <FaShieldAlt />, title: "Garansi", desc: "Uptime 99.8%", color: "from-blue-500 to-cyan-500" },
          { icon: <FaCreditCard />, title: "Harga Murah", desc: "Mulai Rp 10.000", color: "from-pink-500 to-rose-500" }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
              <div className="text-white text-2xl">{feature.icon}</div>
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How to Order */}
      <div className="mt-20 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">Cara Order & Pembayaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Pilih Paket", desc: "Tambahkan paket ke keranjang" },
            { step: "2", title: "Checkout", desc: "Isi data dan upload bukti QRIS" },
            { step: "3", title: "Konfirmasi", desc: "Kirim bukti ke WhatsApp admin" }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-2xl text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== PAKET ====================
function Paket({ cartItems, setCartItems }) {
  const paketList = [
    { 
      id: 1,
      title: "Basic Panel", 
      price: 10000, 
      spec: "1 Core • 1GB RAM • 5GB SSD",
      popular: false
    },
    { 
      id: 2,
      title: "Standard Panel", 
      price: 25000, 
      spec: "2 Core • 2GB RAM • 10GB SSD",
      popular: true
    },
    { 
      id: 3,
      title: "Premium Panel", 
      price: 50000, 
      spec: "4 Core • 4GB RAM • 20GB SSD",
      popular: false
    },
    { 
      id: 4,
      title: "Bot WhatsApp", 
      price: 15000, 
      spec: "Fitur Lengkap + Auto Update",
      popular: false
    },
  ];

  const addToCart = (paket) => {
    const existingItem = cartItems.find(item => item.id === paket.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === paket.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...paket, quantity: 1 }]);
    }
    
    // Show notification
    alert(`${paket.title} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <div className="pt-32 px-8">
      <h1 className="text-4xl font-bold text-center mb-12">Paket Layanan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {paketList.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.id}
            className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/20 transition relative"
          >
            {item.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm">
                POPULAR
              </div>
            )}
            
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-purple-400 text-2xl font-bold mt-2">Rp {item.price.toLocaleString()}</p>
            <p className="text-gray-300 text-sm mt-2">{item.spec}</p>
            
            <button
              onClick={() => addToCart(item)}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl transition-all"
            >
              Tambah ke Cart
            </button>
          </motion.div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 max-w-2xl mx-auto p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">Keranjang Anda</h3>
              <p className="text-gray-400">
                {cartItems.reduce((total, item) => total + item.quantity, 0)} item • 
                Rp {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/cart"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                Lihat Keranjang
              </Link>
              <Link
                to="/checkout"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition-all"
              >
                Checkout
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ==================== CART ====================
function Cart({ cartItems, setCartItems }) {
  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="pt-32 px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Keranjang Belanja</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold mb-2">Keranjang Kosong</h3>
          <p className="text-gray-400 mb-6">Tambahkan paket ke keranjang Anda</p>
          <Link
            to="/paket"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl"
          >
            Lihat Paket
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item, i) => (
              <div
                key={item.id}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-gray-400">{item.spec}</p>
                    <p className="text-purple-500 font-bold mt-2">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span className="text-purple-500">Rp {totalPrice.toLocaleString()}</span>
            </div>
            
            <Link
              to="/checkout"
              className="block w-full text-center mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-3 rounded-xl transition-all"
            >
              Lanjut ke Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== CHECKOUT ====================
function Checkout({ cartItems }) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    notes: '',
    paymentProof: null
  });
  
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, paymentProof: file});
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.whatsapp || !formData.email) {
      alert('Harap isi semua data yang diperlukan!');
      return;
    }
    
    if (!formData.paymentProof) {
      alert('Harap upload bukti pembayaran QRIS!');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate order ID
      const orderId = generateOrderId();
      
      // Format WhatsApp number
      const formattedWhatsApp = formatWhatsApp(formData.whatsapp);
      
      // Prepare order data
      const orderData = {
        name: formData.name,
        whatsapp: formattedWhatsApp,
        email: formData.email,
        notes: formData.notes,
        items: [...cartItems], // Copy cart items
        total: totalPrice,
        date: new Date().toISOString(),
        orderId: orderId
      };
      
      // Save order to localStorage
      localStorage.setItem(`order_${orderId}`, JSON.stringify({
        ...orderData,
        paymentProof: previewImage // Save base64 image
      }));
      
      // Clear cart from localStorage
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Redirect to success page with order data
      navigate('/berhasil', { 
        state: { 
          orderData: orderData,
          cartItems: cartItems,
          paymentProof: previewImage
        }
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 px-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold">Checkout</h2>
      <p className="text-gray-400 mt-2">Isi data diri dan upload bukti pembayaran QRIS</p>
      
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="block mb-2 text-sm text-gray-400">Nama Lengkap *</label>
          <input
            className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Contoh: Budi Santoso"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Nomor WhatsApp *</label>
          <input
            className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Contoh: 081234567890"
            required
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Email *</label>
          <input
            className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="contoh@email.com"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        {/* Upload Bukti Pembayaran */}
        <div>
          <label className="block mb-3 font-bold">
            <FaUpload className="inline mr-2" /> Upload Bukti Pembayaran QRIS *
          </label>
          <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors">
            <input
              type="file"
              id="paymentProof"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <label htmlFor="paymentProof" className="cursor-pointer">
              {previewImage ? (
                <div>
                  <img 
                    src={previewImage} 
                    alt="Bukti Pembayaran" 
                    className="max-h-64 mx-auto rounded-lg mb-4"
                  />
                  <p className="text-green-500">✓ Bukti pembayaran sudah diupload</p>
                  <p className="text-sm text-gray-400">Klik untuk ganti gambar</p>
                </div>
              ) : (
                <div>
                  <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="font-medium">Klik untuk upload bukti pembayaran QRIS</p>
                  <p className="text-sm text-gray-400 mt-2">Format: JPG, PNG (Max 5MB)</p>
                </div>
              )}
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Pastikan bukti pembayaran jelas menampilkan nominal dan kode QRIS
          </p>
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Catatan (Opsional)</label>
          <textarea
            className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Contoh: Tolong aktivasi segera"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block mb-3 font-bold">Metode Pembayaran</label>
          <div className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <FaQrcode className="text-2xl text-green-500" />
              <div>
                <span className="font-bold text-green-500">QRIS Manual</span>
                <p className="text-sm text-gray-400">Upload bukti transfer QRIS</p>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              <p>1. Scan QR Code dengan aplikasi e-wallet/bank</p>
              <p>2. Bayar sesuai total: <strong>Rp {totalPrice.toLocaleString()}</strong></p>
              <p>3. Screenshot/simpan bukti pembayaran</p>
              <p>4. Upload bukti di atas</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-white/5 rounded-xl">
          <h4 className="font-bold mb-2">Ringkasan Order:</h4>
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between py-1">
              <span className="text-gray-400">{item.title} ×{item.quantity}</span>
              <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 font-bold">
            <div className="flex justify-between">
              <span>Total Pembayaran</span>
              <span className="text-purple-500">Rp {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_25px_4px_rgba(168,85,247,0.6)] hover:from-purple-700 hover:to-pink-700 hover:shadow-[0_0_35px_6px_rgba(168,85,247,0.9)] transition-all py-3 rounded-xl mt-2 font-bold text-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Memproses...
            </span>
          ) : (
            <>📤 Upload Bukti & Konfirmasi</>
          )}
        </button>
      </form>
    </div>
  );
}

// ==================== SUCCESS PAGE ====================
function Success() {
  const ADMIN_WHATSAPP = "6281228010210";
  const [orderData, setOrderData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    console.log("Location state:", location.state);
    
    // 1. Coba ambil dari state navigation terlebih dahulu
    if (location.state) {
      const { orderData: stateOrderData, cartItems: stateCartItems } = location.state;
      console.log("State order data:", stateOrderData);
      console.log("State cart items:", stateCartItems);
      
      if (stateOrderData && stateCartItems) {
        setOrderData(stateOrderData);
        setCartItems(stateCartItems);
        return;
      }
    }
    
    // 2. Jika tidak ada di state, coba ambil dari URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    console.log("Order ID from URL:", orderId);
    
    if (orderId) {
      const savedOrder = localStorage.getItem(`order_${orderId}`);
      console.log("Saved order from localStorage:", savedOrder);
      
      if (savedOrder) {
        try {
          const parsedData = JSON.parse(savedOrder);
          setOrderData(parsedData);
          
          // Ambil items dari order data
          if (parsedData.items && parsedData.items.length > 0) {
            setCartItems(parsedData.items);
          } else {
            // Fallback: ambil dari cart
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              setCartItems(JSON.parse(savedCart));
            }
          }
        } catch (error) {
          console.error("Error parsing order data:", error);
        }
      }
    }
    
    // 3. Clear cart dari localStorage setelah berhasil
    localStorage.setItem('cart', JSON.stringify([]));
  }, [location.state]);
  
  useEffect(() => {
    // Generate WhatsApp URL ketika data tersedia
    console.log("Generating WhatsApp URL...");
    console.log("Order data:", orderData);
    console.log("Cart items:", cartItems);
    
    if (orderData && cartItems && cartItems.length > 0) {
      const message = formatWhatsAppMessage(orderData, cartItems);
      console.log("Generated message:", decodeURIComponent(message));
      
      const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${message}`;
      console.log("Final WhatsApp URL:", url);
      
      setWhatsappUrl(url);
    }
  }, [orderData, cartItems]);
  
  // Jika tidak ada data, tampilkan pesan error
  if (!orderData || cartItems.length === 0) {
    return (
      <div className="pt-32 text-center px-8 max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-4xl text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Data Order Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-6">
          Silakan lakukan order kembali atau hubungi admin jika sudah melakukan pembayaran.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl"
          >
            Kembali ke Home
          </Link>
          
          <a
            href={`https://wa.me/${ADMIN_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl"
          >
            <FaWhatsapp className="inline mr-2" /> Hubungi Admin
          </a>
        </div>
      </div>
    );
  }
  
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="pt-32 text-center px-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
      >
        <FaCheckCircle className="text-4xl text-white" />
      </motion.div>
      
      <h2 className="text-4xl font-bold text-purple-500">✓ Order Berhasil Dikirim</h2>
      <p className="text-gray-300 mt-4 text-lg">
        Bukti pembayaran Anda telah tersimpan. Langkah terakhir: konfirmasi ke admin via WhatsApp.
      </p>
      
      <div className="mt-8 p-6 bg-white/5 rounded-2xl backdrop-blur-sm text-left border border-green-500/20">
        <h3 className="text-xl font-bold mb-4">📋 Detail Order Anda</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Order ID</span>
            <span className="font-mono font-bold text-purple-400">{orderData.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Nama</span>
            <span>{orderData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">WhatsApp</span>
            <span>{orderData.whatsapp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Pembayaran</span>
            <span className="font-bold text-purple-500">Rp {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Metode</span>
            <span className="text-green-500">QRIS Manual</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="text-yellow-500 font-medium">⏳ Menunggu Konfirmasi Admin</span>
          </div>
        </div>
        
        {/* Cart Items Summary */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="font-bold mb-3">🛒 Item yang Dipesan:</h4>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-white/5">
              <div>
                <span className="font-medium">{item.title}</span>
                <p className="text-sm text-gray-400">{item.spec}</p>
              </div>
              <div className="text-right">
                <p>{item.quantity} × Rp {item.price.toLocaleString()}</p>
                <p className="text-purple-400 font-bold">Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">🚀 Langkah Terakhir: Konfirmasi ke Admin</h3>
        <p className="text-gray-400 mb-6">
          Klik tombol di bawah untuk mengirim detail order & bukti pembayaran ke WhatsApp Admin
        </p>
        
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30"
        >
          <FaWhatsapp className="text-2xl" />
          Kirim Konfirmasi ke WhatsApp Admin
        </a>
        
        <p className="text-sm text-gray-500 mt-4">
          * Pesan sudah otomatis berisi detail order Anda. Admin akan merespons dalam 5 menit.
        </p>
        
        {/* Debug info (hapus di production) */}
        <div className="mt-4 p-2 bg-black/30 rounded text-xs text-gray-400">
          <p>Debug: {whatsappUrl ? "URL tersedia" : "URL kosong"}</p>
          <p>Items: {cartItems.length} item</p>
        </div>
      </div>
      
      {/* Important Notes */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <FaReceipt /> Catatan Penting:
        </h4>
        <ul className="text-sm text-gray-300 text-left space-y-2">
          <li>✅ <strong>Simpan Order ID</strong> untuk konfirmasi ulang jika diperlukan</li>
          <li>✅ Admin akan mengirimkan informasi login panel/server setelah konfirmasi</li>
          <li>✅ Proses aktivasi maksimal 15 menit setelah konfirmasi WhatsApp</li>
          <li>✅ Jika belum mendapatkan balasan dalam 30 menit, hubungi admin via Telegram</li>
          <li>✅ Simpan bukti pembayaran sebagai arsip pribadi</li>
        </ul>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-purple-600 hover:bg-purple-600/20 px-6 py-3 rounded-xl"
        >
          ← Kembali ke Home
        </Link>
        
        <a
          href="https://t.me/bothub_support"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-3 rounded-xl"
        >
          <FaTelegram /> Telegram Support
        </a>
      </div>
    </div>
  );
}

// ==================== FOOTER ====================
function Footer() {
  const ADMIN_WHATSAPP = "4915510753485";
  
  return (
    <footer className="mt-20 py-8 px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">SEWA BOT & PANEL</h2>
        <p className="text-gray-400 mb-6">© 2024 All rights reserved</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <a href={`https://wa.me/${ADMIN_WHATSAPP}`} className="text-gray-400 hover:text-green-500">
            <FaWhatsapp className="text-2xl" />
          </a>
          <a href="https://t.me/bothub_support" className="text-gray-400 hover:text-blue-500">
            <FaTelegram className="text-2xl" />
          </a>
          <a href="https://instagram.com/bothub.id" className="text-gray-400 hover:text-pink-500">
            <FaInstagram className="text-2xl" />
          </a>
        </div>
        
        <div className="text-gray-500 text-sm">
          <p>Metode Pembayaran: <span className="text-green-400 font-bold">QRIS Manual</span></p>
          <p className="mt-2">Dana • OVO • GoPay • ShopeePay • QRIS • Bank Transfer</p>
          <p className="mt-2">Upload bukti bayar dan konfirmasi via WhatsApp untuk aktivasi cepat</p>
        </div>
        
        <div className="mt-6 p-4 bg-white/5 rounded-xl max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3">
            <FaShieldAlt className="text-green-500" />
            <span className="font-bold">Sistem Manual yang Aman</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Semua transaksi diverifikasi manual oleh admin untuk keamanan maksimal
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cartItems]);
  
  return (
    <Router>
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-purple-900/20 to-black text-white font-inter">
        <Navbar cartItems={cartItems} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paket" element={<Paket cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
          <Route path="/berhasil" element={<Success />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
