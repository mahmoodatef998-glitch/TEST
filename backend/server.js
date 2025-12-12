const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sql = require('./neonClient');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Save to Neon database if available, otherwise log to console
    if (sql) {
      try {
        const result = await sql`
          INSERT INTO contact_messages (name, email, phone, message)
          VALUES (${name}, ${email}, ${phone}, ${message})
          RETURNING *
        `;

        console.log('✅ Message saved to Neon database:', result[0]);
      } catch (dbError) {
        console.error('Neon database error:', dbError);
        // Fallback to console log
        console.log('New contact form submission:', {
          name,
          email,
          phone,
          message,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // Fallback: log to console if Neon is not configured
      console.log('New contact form submission:', {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will contact you soon.',
    });
    } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
});

// Products endpoint
app.get('/api/products', (req, res) => {
  const products = {
    perkins: [
      {
        id: 1,
        name: 'PERKINS 1104D-44TA',
        power: '100-150 kVA',
        features: ['4 أسطوانات', 'تبريد مائي', 'نظام تحكم رقمي', 'ضمان 2 سنة'],
        specifications: {
          engine: 'PERKINS 1104D-44TA',
          cylinders: 4,
          power: '100-150 kVA',
          fuel: 'ديزل',
          cooling: 'مائي',
        },
      },
      {
        id: 2,
        name: 'PERKINS 4006-23TRG1',
        power: '200-300 kVA',
        features: ['6 أسطوانات', 'تبريد مائي', 'نظام حماية متقدم', 'ضمان 2 سنة'],
        specifications: {
          engine: 'PERKINS 4006-23TRG1',
          cylinders: 6,
          power: '200-300 kVA',
          fuel: 'ديزل',
          cooling: 'مائي',
        },
      },
      {
        id: 3,
        name: 'PERKINS 4012-46TRS2',
        power: '500-750 kVA',
        features: ['12 أسطوانة', 'تبريد مائي', 'نظام إدارة متكامل', 'ضمان 2 سنة'],
        specifications: {
          engine: 'PERKINS 4012-46TRS2',
          cylinders: 12,
          power: '500-750 kVA',
          fuel: 'ديزل',
          cooling: 'مائي',
        },
      },
    ],
    cummins: [
      {
        id: 1,
        name: 'CUMMINS QSB6.7',
        power: '150-200 kVA',
        features: ['6 أسطوانات', 'تبريد مائي', 'تقنية SCR', 'ضمان 3 سنوات'],
        specifications: {
          engine: 'CUMMINS QSB6.7',
          cylinders: 6,
          power: '150-200 kVA',
          fuel: 'ديزل',
          cooling: 'مائي',
        },
      },
      {
        id: 2,
        name: 'CUMMINS QSL9',
        power: '300-450 kVA',
        features: ['6 أسطوانات', 'تبريد مائي', 'نظام PowerCommand', 'ضمان 3 سنوات'],
        specifications: {
          engine: 'CUMMINS QSL9',
          cylinders: 6,
          power: '300-450 kVA',
          fuel: 'ديزل',
          cooling: 'مائي',
        },
      },
      {
        id: 3,
        name: 'CUMMINS QSK60',
        power: '1000-1500 kVA',
        features: ['16 أسطوانة', 'تبريد مائي', 'نظام إدارة متقدم', 'ضمان 3 سنوات'],
        specifications: {
          engine: 'CUMMINS QSK60',
          cylinders: 16,
          power: '1000-1500 kVA',
          fuel: 'ديزل',
          cooling: 'مائي',
        },
      },
    ],
  };

  res.json({
    success: true,
    data: products,
  });
});

// Services endpoint
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 1,
      title: 'تركيب المولدات',
      description: 'خدمة تركيب احترافية من قبل فنيين معتمدين',
      icon: '🔌',
    },
    {
      id: 2,
      title: 'الصيانة الدورية',
      description: 'برامج صيانة شاملة لضمان الأداء الأمثل',
      icon: '🔧',
    },
    {
      id: 3,
      title: 'إصلاح الأعطال',
      description: 'خدمة إصلاح سريعة وفعالة',
      icon: '⚙️',
    },
    {
      id: 4,
      title: 'الاستشارات الفنية',
      description: 'استشارات من خبراء لاختيار المولد المناسب',
      icon: '📋',
    },
    {
      id: 5,
      title: 'قطع الغيار',
      description: 'مخزون واسع من قطع الغيار الأصلية',
      icon: '📦',
    },
    {
      id: 6,
      title: 'التدريب',
      description: 'برامج تدريبية شاملة للمشغلين',
      icon: '🎓',
    },
  ];

  res.json({
    success: true,
    data: services,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

