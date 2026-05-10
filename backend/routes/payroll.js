const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Payroll = require('../models/Payroll');
const History = require('../models/History');
console.log('PAYROLL MODEL:', Payroll);
console.log('HISTORY MODEL:', History);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    console.log('FILE:', req.file);

    if (!req.file) {
      return res.status(400).json({
        error: 'File tidak ditemukan'
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    console.log('SHEET:', sheetName);

    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    console.log('DATA EXCEL:', data);

    if (!data.length) {
      return res.status(400).json({
        error: 'Excel kosong atau format salah'
      });
    }

    const formatted = data.map(row => ({
      no: row['no'] || row['NO'],
      nopeg: row['NOPEG'] || row['nopeg'],
      nama: row['Nama pegawai'] || row['NAMA PEGAWAI'] || row['nama'],
      project: row['project'] || row['PROJECT'],
      unit: row['unit'] || row['UNIT'],
      jumlahBayar: row['jumbyar'] || row['jumlahbayar'] || row['JUMLAH BAYAR'],
      rekening: row['rekening'] || row['REKENING'],
      bank: row['bank'] || row['BANK'],
      tahap: row['tahap'] || row['TAHAP'],
    }));

    console.log('FORMATTED:', formatted);

    await Payroll.deleteMany({});
    await Payroll.insertMany(formatted);
    await History.create({
      type: 'IMPORT',

      fileName: req.file.originalname
    })

    res.json({
      success: true,
      total: formatted.length,
      data: formatted
    });

  } catch (err) {
    console.error('IMPORT ERROR:', err);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

router.get('/grouped', async (req, res) => {
  try {
    const data = await Payroll.find({}).sort({ project: 1 });
    const grouped = {};
    data.forEach(item => {
      const key = item.project || 'Tanpa Project';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    res.json({ success: true, grouped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/export-grouped', async (req, res) => {
  try {
    const data = await Payroll.find({}).sort({ project: 1 });
    const wb = XLSX.utils.book_new();
    const grouped = {};
    data.forEach(item => {
      const key = item.project || 'Tanpa Project';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    Object.entries(grouped).forEach(([project, rows]) => {
      const sheetData = rows.map(r => ({
        NO: r.no, NOPEG: r.nopeg, 'NAMA PEGAWAI': r.nama,
        PROJECT: r.project, UNIT: r.unit, 'JUMLAH BAYAR': r.jumlahBayar,
        REKENING: r.rekening, BANK: r.bank, TAHAP: r.tahap
      }));
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, project.substring(0, 31));
    });
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=payroll_grouped.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await History.create({

      type: 'EXPORT',

      fileName: 'payroll_grouped.xlsx'
    })
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/export-bank', async (req, res) => {
  try {
    const data = await Payroll.find({}).sort({ bank: 1, tahap: 1 });
    const wb = XLSX.utils.book_new();
    const grouped = {};
    data.forEach(item => {
      const key = `${item.bank || 'UNKNOWN'}_tahap${item.tahap || '0'}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    Object.entries(grouped).forEach(([key, rows]) => {
      const sheetData = rows.map(r => ({
        NO: r.no, NOPEG: r.nopeg, 'NAMA PEGAWAI': r.nama,
        PROJECT: r.project, UNIT: r.unit, 'JUMLAH BAYAR': r.jumlahBayar,
        REKENING: r.rekening, BANK: r.bank, TAHAP: r.tahap
      }));
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, key.substring(0, 31));
    });
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=payroll_per_bank.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await History.create({

  type: 'EXPORT',

  fileName: 'payroll_per_bank.xlsx'
})
    res.send(buffer);
  } catch (err) {
    console.error('ERROR IMPORT:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
router.get('/stats', async (req, res) => {
  try {
    const data = await Payroll.find();

    const totalPegawai = data.length;

    const totalBayar = data.reduce(
      (sum, item) => sum + Number(item.jumlahBayar || 0),
      0
    );

    const totalBank = [...new Set(data.map(i => i.bank))].length;

    const totalProject = [...new Set(data.map(i => i.project))].length;

    res.json({
      success: true,
      totalPegawai,
      totalBayar,
      totalBank,
      totalProject
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
router.get('/history', async (req, res) => {

  try {

    const data = await History.find()
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data
    })

  } catch (err) {

    res.status(500).json({
      error: err.message
    })
  }
})
router.put('/:id', async (req, res) => {

  try {

    const updated = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
        nama: req.body.nama,
        rekening: req.body.rekening,
        bank: req.body.bank,
        tahap: req.body.tahap
      },
      { new: true }
    )

    res.json({
      success: true,
      data: updated
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      error: err.message
    })
  }
})
router.post('/export-group', async (req, res) => {
  try {
    const { key, rows } = req.body
    const wb = XLSX.utils.book_new()
    const sheetData = rows.map(r => ({
      NOPEG: r.nopeg,
      'NAMA PEGAWAI': r.nama,
      PROJECT: r.project,
      UNIT: r.unit,
      REKENING: r.rekening,
      BANK: r.bank,
      TAHAP: r.tahap,
      'JUMLAH BAYAR': r.jumlahBayar,
    }))
    const ws = XLSX.utils.json_to_sheet(sheetData)
    XLSX.utils.book_append_sheet(wb, ws, key.substring(0, 31))
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Disposition', `attachment; filename=${key}.xlsx`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buffer)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// DELETE pegawai
router.delete('/:id', async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST tambah pegawai manual
router.post('/tambah', async (req, res) => {
  try {
    const pegawai = new Payroll({
      no: req.body.no,
      nopeg: req.body.nopeg,
      nama: req.body.nama,
      project: req.body.project,
      unit: req.body.unit,
      jumlahBayar: req.body.jumlahBayar,
      rekening: req.body.rekening,
      bank: req.body.bank,
      tahap: req.body.tahap,
    })
    await pegawai.save()
    res.json({ success: true, data: pegawai })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
module.exports = router;