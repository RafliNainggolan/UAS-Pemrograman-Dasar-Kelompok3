const readline: {
  createInterface(options: { input: unknown; output: unknown }): {
    question(prompt: string, callback: (answer: string) => void): void;
    close(): void;
  };
} = eval("require")("readline");

// ============================================================================
// 1. INTERFACE / TIPE DATA (TypeScript Typing)
// ============================================================================
interface DataPengiriman {
  idResi: string;
  namaPengirim: string;
  namaPenerima: string;
  beratAktual: number;
  panjang: number;
  lebar: number;
  tinggi: number;
  jarak: number;
  layanan: string;
  namaLayanan: string;
  zona: string;
  namaZona: string;
  beratVolumetrik: number;
  beratTagihan: number;
  tarifPerKg: number;
  ongkirDasar: number;
  biayaTambahan: number;
  totalOngkir: number;
  waktuInput: string;
}

// ============================================================================
// 2. KONSTANTA TETAP (DARI UTS)
// ============================================================================
const PEMBAGI_VOLUMETRIK: number = 6000;
const BATAS_JARAK: number = 100;
const BATAS_BERAT: number = 5;

// [MATERI UAS]: STRUKTUR DATA ARRAY
// Digunakan sebagai in-memory database untuk menyimpan kumpulan data paket
const databasePengiriman: DataPengiriman[] = [];

// Helper Readline dengan Promise (menggantikan callback hell dari versi UTS)
const rl = readline.createInterface({
  input: eval("process.stdin"),
  output: eval("process.stdout"),
});

const tanya = (pertanyaan: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(pertanyaan, (jawaban) => {
      resolve(jawaban.trim());
    });
  });
};

// ============================================================================
// 3. [MATERI UAS]: FUNGSI FORMAT RUPIAH
// ============================================================================
function formatRupiah(angka: number): string {
  return "Rp" + angka.toLocaleString("id-ID");
}

// ============================================================================
// 4. [MATERI UAS & UTS]: FUNGSI LOGIKA PERHITUNGAN ONGKIR
// Mempertahankan operator, if-else, switch, dan nested conditional dari UTS
// ============================================================================
function hitungKalkulasiOngkir(
  beratAktual: number,
  panjang: number,
  lebar: number,
  tinggi: number,
  jarak: number,
  layanan: string,
  zona: string
): {
  valid: boolean;
  pesanError?: string;
  beratVolumetrik: number;
  beratTagihan: number;
  tarifPerKg: number;
  namaLayanan: string;
  namaZona: string;
  ongkirDasar: number;
  biayaTambahan: number;
  totalOngkir: number;
} {
  let tarifPerKg = 0;
  let namaLayanan = "";
  let layananValid = true;

  // [MATERI UTS]: SWITCH 1 - Memilih tarif per kg berdasarkan layanan
  switch (layanan) {
    case "1":
      tarifPerKg = 5000;
      namaLayanan = "Reguler (3-5 hari)";
      break;
    case "2":
      tarifPerKg = 7000;
      namaLayanan = "Express (1-2 hari)";
      break;
    case "3":
      tarifPerKg = 9000;
      namaLayanan = "Overnight (24 jam)";
      break;
    default:
      layananValid = false;
      namaLayanan = "Tidak Valid";
      break;
  }

  // [MATERI UTS]: IF 1 & EKSPRESI OPERATOR LOGIKA - Memeriksa validitas input
  const inputAngkaValid =
    Number.isFinite(beratAktual) &&
    Number.isFinite(panjang) &&
    Number.isFinite(lebar) &&
    Number.isFinite(tinggi) &&
    Number.isFinite(jarak) &&
    beratAktual > 0 &&
    panjang > 0 &&
    lebar > 0 &&
    tinggi > 0 &&
    jarak > 0 &&
    layananValid &&
    tarifPerKg > 0;

  if (!inputAngkaValid) {
    return {
      valid: false,
      pesanError: "Input data angka tidak valid atau layanan di luar pilihan!",
      beratVolumetrik: 0,
      beratTagihan: 0,
      tarifPerKg: 0,
      namaLayanan: "",
      namaZona: "",
      ongkirDasar: 0,
      biayaTambahan: 0,
      totalOngkir: 0,
    };
  }

  // [MATERI UTS]: EKSPRESI ARITMATIKA - Menghitung berat volumetrik
  const beratVolumetrik = (panjang * lebar * tinggi) / PEMBAGI_VOLUMETRIK;

  // [MATERI UTS]: IF 2 - Membandingkan berat volumetrik vs berat aktual
  let beratTagihan = 0;
  if (beratVolumetrik > beratAktual) {
    beratTagihan = Math.ceil(beratVolumetrik);
  } else {
    beratTagihan = Math.ceil(beratAktual);
  }

  // [MATERI UTS]: EKSPRESI ARITMATIKA - Menghitung ongkir dasar
  const ongkirDasar = beratTagihan * tarifPerKg;

  let biayaTambahan = 0;
  let namaZona = "Non-Surcharge";

  // [MATERI UTS]: NESTED CONDITIONAL (IF BERSARANG & SWITCH DI DALAM IF)
  // IF 3: Memeriksa apakah jarak melebihi batas (100 km)
  if (jarak > BATAS_JARAK) {
    // IF 4: Memeriksa apakah berat paket >= batas berat (5 kg)
    if (beratTagihan >= BATAS_BERAT) {
      // SWITCH 2: Menentukan biaya surcharge berdasarkan zona
      switch (zona) {
        case "1":
          namaZona = "Zona 1 (0-40 km)";
          biayaTambahan = 3000;
          break;
        case "2":
          namaZona = "Zona 2 (40-80 km)";
          biayaTambahan = 7000;
          break;
        case "3":
          namaZona = "Zona 3 (80-120 km)";
          biayaTambahan = 11000;
          break;
        default:
          namaZona = "Zona Tidak Dikenal";
          biayaTambahan = 0;
          break;
      }
    } else {
      // Berat di bawah 5 kg meskipun jarak > 100 km
      biayaTambahan = 0;
      namaZona = "Tanpa Biaya (Berat < 5kg)";
    }
  } else {
    // Jarak <= 100 km
    biayaTambahan = 0;
    namaZona = "Bebas Biaya Zona (Jarak <= 100km)";
  }

  // [MATERI UTS]: OPERATOR PENJUMLAHAN - Total Ongkir
  const totalOngkir = ongkirDasar + biayaTambahan;

  return {
    valid: true,
    beratVolumetrik,
    beratTagihan,
    tarifPerKg,
    namaLayanan,
    namaZona,
    ongkirDasar,
    biayaTambahan,
    totalOngkir,
  };
}

// ============================================================================
// 5. [MATERI UAS]: OPERASI CRUD (Create, Read, Update, Delete) & Search
// ============================================================================

// --- CREATE: Tambah Data Pengiriman Baru ---
async function menuTambahPengiriman(): Promise<void> {
  console.log("\n========================================");
  console.log("       INPUT PENGIRIMAN PAKET BARU      ");
  console.log("========================================");

  const namaPengirim = await tanya("Nama Pengirim               : ");
  const namaPenerima = await tanya("Nama Penerima               : ");
  const beratAktual = Number(await tanya("Berat aktual paket (kg, angka saja)     : "));
  const panjang = Number(await tanya("Panjang dimensi (cm, angka saja)        : "));
  const lebar = Number(await tanya("Lebar dimensi (cm, angka saja)          : "));
  const tinggi = Number(await tanya("Tinggi dimensi (cm, angka saja)         : "));
  const jarak = Number(await tanya("Jarak pengiriman (km, angka saja)       : "));

  console.log("\nPilihan Layanan:");
  console.log("1. Reguler (3-5 hari kerja)  - Rp5.000/kg");
  console.log("2. Express (1-2 hari kerja)  - Rp7.000/kg");
  console.log("3. Overnight (dalam 24 jam)  - Rp9.000/kg");
  const layanan = await tanya("Pilih Layanan (1-3)         : ");

  console.log("\nPilihan Zona Tambahan (jika jarak > 100km & berat >= 5kg):");
  console.log("1. Zona 1 (0-40 km)   - +Rp3.000");
  console.log("2. Zona 2 (40-80 km)  - +Rp7.000");
  console.log("3. Zona 3 (80-120 km) - +Rp11.000");
  const zona = await tanya("Pilih Zona Pengiriman (1-3) : ");

  // Panggil fungsi perhitungan
  const hasil = hitungKalkulasiOngkir(
    beratAktual,
    panjang,
    lebar,
    tinggi,
    jarak,
    layanan,
    zona
  );

  if (!hasil.valid) {
    console.log(`\nGagal Menyimpan: ${hasil.pesanError}`);
    return;
  }

  // Buat ID Resi unik otomatis
  const idResi = `EXP-${Date.now().toString().slice(-6)}`;
  const waktuInput = new Date().toLocaleString("id-ID");

  const dataBaru: DataPengiriman = {
    idResi,
    namaPengirim,
    namaPenerima,
    beratAktual,
    panjang,
    lebar,
    tinggi,
    jarak,
    layanan,
    namaLayanan: hasil.namaLayanan,
    zona,
    namaZona: hasil.namaZona,
    beratVolumetrik: hasil.beratVolumetrik,
    beratTagihan: hasil.beratTagihan,
    tarifPerKg: hasil.tarifPerKg,
    ongkirDasar: hasil.ongkirDasar,
    biayaTambahan: hasil.biayaTambahan,
    totalOngkir: hasil.totalOngkir,
    waktuInput,
  };

  // [MATERI UAS]: Menambahkan data ke array dengan method push()
  databasePengiriman.push(dataBaru);

  console.log("\n========================================");
  console.log("          RINCIAN TIKET RESI            ");
  console.log("========================================");
  console.log(`Nomor Resi        : ${dataBaru.idResi}`);
  console.log(`Pengirim/Penerima : ${dataBaru.namaPengirim} ➡️ ${dataBaru.namaPenerima}`);
  console.log(`Layanan           : ${dataBaru.namaLayanan}`);
  console.log(`Berat Aktual      : ${dataBaru.beratAktual} kg`);
  console.log(`Berat Volumetrik  : ${dataBaru.beratVolumetrik.toFixed(2)} kg`);
  console.log(`Berat Tagihan     : ${dataBaru.beratTagihan} kg`);
  console.log(`Tarif / Kg        : ${formatRupiah(dataBaru.tarifPerKg)}`);
  console.log(`Ongkir Dasar      : ${formatRupiah(dataBaru.ongkirDasar)}`);
  console.log(`Biaya Tambahan    : ${formatRupiah(dataBaru.biayaTambahan)} (${dataBaru.namaZona})`);
  console.log(`----------------------------------------`);
  console.log(`TOTAL ONGKIR      : ${formatRupiah(dataBaru.totalOngkir)}`);
  console.log("========================================");
  console.log(" Data pengiriman paket berhasil disimpan ke sistem!");
}

// --- READ: Tampilkan Seluruh Data Pengiriman ---
function menuTampilkanSemuaPengiriman(): void {
  console.log("\n==========================================================================================");
  console.log("                            DAFTAR PENGIRIMAN PAKET TERSIMPAN                             ");
  console.log("==========================================================================================");

  // [MATERI UTS/UAS]: IF kondisi pengecekan panjang array
  if (databasePengiriman.length === 0) {
    console.log(" Belum ada data pengiriman yang tersimpan.");
    console.log("==========================================================================================");
    return;
  }

  // Header Tabel
  console.log(
    "| No | No. Resi   | Pengirim   | Penerima   | Layanan   | Berat Tagih | Jarak (km) | Total Ongkir |"
  );
  console.log(
    "|----+------------+------------+------------+-----------+-------------+------------+--------------|"
  );

  // [MATERI UAS]: PENGULANGAN (LOOP) menggunakan for
  for (let i = 0; i < databasePengiriman.length; i++) {
    const p = databasePengiriman[i];
    const no = (i + 1).toString().padEnd(2, " ");
    const resi = p.idResi.padEnd(10, " ");
    const pengirim = p.namaPengirim.slice(0, 10).padEnd(10, " ");
    const penerima = p.namaPenerima.slice(0, 10).padEnd(10, " ");
    const layanan = p.layanan === "1" ? "Reguler" : p.layanan === "2" ? "Express" : "Overnight";
    const layananPad = layanan.padEnd(9, " ");
    const beratPad = `${p.beratTagihan} kg`.padEnd(11, " ");
    const jarakPad = `${p.jarak}`.padEnd(10, " ");
    const totalPad = formatRupiah(p.totalOngkir).padEnd(12, " ");

    console.log(
      `| ${no} | ${resi} | ${pengirim} | ${penerima} | ${layananPad} | ${beratPad} | ${jarakPad} | ${totalPad} |`
    );
  }
  console.log("==========================================================================================");
  console.log(`Total Paket Terdaftar: ${databasePengiriman.length} paket.`);
}

// --- SEARCH: Cari Paket berdasarkan Resi / Penerima ---
async function menuCariPengiriman(): Promise<void> {
  console.log("\n========================================");
  console.log("          PENCARIAN DATA PAKET          ");
  console.log("========================================");

  if (databasePengiriman.length === 0) {
    console.log(" Database masih kosong. Tidak ada data untuk dicari.");
    return;
  }

  const keyword = (await tanya("Masukkan No. Resi atau Nama Penerima: ")).toLowerCase();

  // [MATERI UAS]: SEARCHING dengan perulangan for...of dan method filter/includes
  const hasilCari: DataPengiriman[] = [];
  for (const item of databasePengiriman) {
    if (
      item.idResi.toLowerCase().includes(keyword) ||
      item.namaPenerima.toLowerCase().includes(keyword) ||
      item.namaPengirim.toLowerCase().includes(keyword)
    ) {
      hasilCari.push(item);
    }
  }

  if (hasilCari.length === 0) {
    console.log(` Data dengan kata kunci "${keyword}" tidak ditemukan.`);
  } else {
    console.log(`\n Ditemukan ${hasilCari.length} data yang cocok:`);
    for (const data of hasilCari) {
      console.log("----------------------------------------");
      console.log(`Resi          : ${data.idResi}`);
      console.log(`Pengirim      : ${data.namaPengirim}`);
      console.log(`Penerima      : ${data.namaPenerima}`);
      console.log(`Layanan       : ${data.namaLayanan}`);
      console.log(`Jarak & Zona  : ${data.jarak} km (${data.namaZona})`);
      console.log(`Berat Tagihan : ${data.beratTagihan} kg (Aktual: ${data.beratAktual}kg, Vol: ${data.beratVolumetrik.toFixed(1)}kg)`);
      console.log(`Total Biaya   : ${formatRupiah(data.totalOngkir)}`);
      console.log(`Tanggal Input : ${data.waktuInput}`);
    }
    console.log("----------------------------------------");
  }
}

// --- UPDATE: Ubah Data Paket & Hitung Ulang Ongkir ---
async function menuUbahPengiriman(): Promise<void> {
  console.log("\n========================================");
  console.log("       PERBARUI DATA PENGIRIMAN         ");
  console.log("========================================");

  if (databasePengiriman.length === 0) {
    console.log("Database masih kosong.");
    return;
  }

  const resiTarget = await tanya("Masukkan No. Resi yang ingin diubah: ");

  // Cari index data
  let indexDitemukan = -1;
  for (let i = 0; i < databasePengiriman.length; i++) {
    if (databasePengiriman[i].idResi.toLowerCase() === resiTarget.toLowerCase()) {
      indexDitemukan = i;
      break;
    }
  }

  if (indexDitemukan === -1) {
    console.log(` Paket dengan nomor resi ${resiTarget} tidak ditemukan.`);
    return;
  }

  const paketLama = databasePengiriman[indexDitemukan];
  console.log(`\nData saat ini untuk resi ${paketLama.idResi}:`);
  console.log(`Pengirim: ${paketLama.namaPengirim}, Penerima: ${paketLama.namaPenerima}`);
  console.log(`Berat: ${paketLama.beratAktual} kg, Jarak: ${paketLama.jarak} km, Layanan: ${paketLama.namaLayanan}`);
  console.log("Silakan masukkan data baru (tekan Enter langsung jika tidak ingin mengubah):\n");

  const inputPengirim = await tanya(`Nama Pengirim baru [${paketLama.namaPengirim}]: `);
  const inputPenerima = await tanya(`Nama Penerima baru [${paketLama.namaPenerima}]: `);
  const inputBerat = await tanya(`Berat Aktual (kg) [${paketLama.beratAktual}]: `);
  const inputPanjang = await tanya(`Panjang (cm) [${paketLama.panjang}]: `);
  const inputLebar = await tanya(`Lebar (cm) [${paketLama.lebar}]: `);
  const inputTinggi = await tanya(`Tinggi (cm) [${paketLama.tinggi}]: `);
  const inputJarak = await tanya(`Jarak (km) [${paketLama.jarak}]: `);
  const inputLayanan = await tanya(`Layanan (1-3) [${paketLama.layanan}]: `);
  const inputZona = await tanya(`Zona (1-3) [${paketLama.zona}]: `);

  // Ambil nilai baru atau gunakan nilai lama jika kosong
  const beratAktualBaru = inputBerat ? Number(inputBerat) : paketLama.beratAktual;
  const panjangBaru = inputPanjang ? Number(inputPanjang) : paketLama.panjang;
  const lebarBaru = inputLebar ? Number(inputLebar) : paketLama.lebar;
  const tinggiBaru = inputTinggi ? Number(inputTinggi) : paketLama.tinggi;
  const jarakBaru = inputJarak ? Number(inputJarak) : paketLama.jarak;
  const layananBaru = inputLayanan ? inputLayanan : paketLama.layanan;
  const zonaBaru = inputZona ? inputZona : paketLama.zona;

  // Hitung ulang ongkir dengan fungsi kalkulasi
  const hasilBaru = hitungKalkulasiOngkir(
    beratAktualBaru,
    panjangBaru,
    lebarBaru,
    tinggiBaru,
    jarakBaru,
    layananBaru,
    zonaBaru
  );

  if (!hasilBaru.valid) {
    console.log(`\n Gagal Update: ${hasilBaru.pesanError}`);
    return;
  }

  // Update object di dalam array
  databasePengiriman[indexDitemukan] = {
    ...paketLama,
    namaPengirim: inputPengirim || paketLama.namaPengirim,
    namaPenerima: inputPenerima || paketLama.namaPenerima,
    beratAktual: beratAktualBaru,
    panjang: panjangBaru,
    lebar: lebarBaru,
    tinggi: tinggiBaru,
    jarak: jarakBaru,
    layanan: layananBaru,
    zona: zonaBaru,
    namaLayanan: hasilBaru.namaLayanan,
    namaZona: hasilBaru.namaZona,
    beratVolumetrik: hasilBaru.beratVolumetrik,
    beratTagihan: hasilBaru.beratTagihan,
    tarifPerKg: hasilBaru.tarifPerKg,
    ongkirDasar: hasilBaru.ongkirDasar,
    biayaTambahan: hasilBaru.biayaTambahan,
    totalOngkir: hasilBaru.totalOngkir,
  };

  console.log(`\n Data resi ${paketLama.idResi} berhasil diperbarui!`);
  console.log(`Total Ongkir Baru: ${formatRupiah(hasilBaru.totalOngkir)}`);
}

// --- DELETE: Hapus Data Pengiriman ---
async function menuHapusPengiriman(): Promise<void> {
  console.log("\n========================================");
  console.log("         HAPUS DATA PENGIRIMAN          ");
  console.log("========================================");

  if (databasePengiriman.length === 0) {
    console.log(" Database masih kosong.");
    return;
  }

  const resiHapus = await tanya("Masukkan No. Resi yang ingin dihapus: ");

  let indexHapus = -1;
  for (let i = 0; i < databasePengiriman.length; i++) {
    if (databasePengiriman[i].idResi.toLowerCase() === resiHapus.toLowerCase()) {
      indexHapus = i;
      break;
    }
  }

  if (indexHapus === -1) {
    console.log(` Data resi ${resiHapus} tidak ditemukan.`);
    return;
  }

  const konfirmasi = await tanya(
    `Apakah Anda yakin ingin menghapus data resi ${databasePengiriman[indexHapus].idResi}? (y/n): `
  );

  if (konfirmasi.toLowerCase() === "y") {
    // [MATERI UAS]: Menghapus elemen dari array dengan splice()
    const terhapus = databasePengiriman.splice(indexHapus, 1);
    console.log(` Paket dengan nomor resi ${terhapus[0].idResi} berhasil dihapus.`);
  } else {
    console.log("Penghapusan data dibatalkan.");
  }
}

// ============================================================================
// 6. [MATERI UAS]: MAIN LOOP PROGRAM (WHILE & SWITCH MENU UTAMA)
// ============================================================================
async function main(): Promise<void> {
  let berjalan = true;

  // [MATERI UAS]: PENGULANGAN (WHILE LOOP) agar program tidak langsung keluar
  while (berjalan) {
    console.log("\n========================================================");
    console.log("    APLIKASI MANAJEMEN ONGKIR PAKET (CONSOLE TS)        ");
    console.log("========================================================");
    console.log("1. Buat Pengiriman Baru (Hitung Ongkir)");
    console.log("2. Tampilkan Semua Pengiriman");
    console.log("3. Cari Data Pengiriman (Resi / Penerima)");
    console.log("4. Ubah Data Pengiriman");
    console.log("5. Hapus Data Pengiriman");
    console.log("6. Keluar dari Aplikasi");
    console.log("--------------------------------------------------------");

    const pilihan = await tanya("Pilih Menu (1-6): ");

    // [MATERI UTS]: SWITCH CASE untuk routing menu
    switch (pilihan) {
      case "1":
        await menuTambahPengiriman();
        break;
      case "2":
        menuTampilkanSemuaPengiriman();
        break;
      case "3":
        await menuCariPengiriman();
        break;
      case "4":
        await menuUbahPengiriman();
        break;
      case "5":
        await menuHapusPengiriman();
        break;
      case "6":
        console.log("\nTerima kasih telah menggunakan sistem kalkulasi ongkir. Sampai jumpa!");
        berjalan = false;
        rl.close();
        break;
      default:
        console.log("Pilihan tidak valid. Silakan pilih menu nomor 1 sampai 6.");
        break;
    }
  }
}

// Jalankan program utama
main().catch((eror) => {
  console.error("Terjadi kesalahan sistem:", eror);
  rl.close();
});
