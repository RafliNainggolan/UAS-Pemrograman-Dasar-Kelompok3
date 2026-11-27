var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var readline = eval("require")("readline");
// ============================================================================
// 2. KONSTANTA TETAP (DARI UTS)
// ============================================================================
var PEMBAGI_VOLUMETRIK = 6000;
var BATAS_JARAK = 100;
var BATAS_BERAT = 5;
// [MATERI UAS]: STRUKTUR DATA ARRAY
// Digunakan sebagai in-memory database untuk menyimpan kumpulan data paket
var databasePengiriman = [];
// Helper Readline dengan Promise (menggantikan callback hell dari versi UTS)
var rl = readline.createInterface({
    input: eval("process.stdin"),
    output: eval("process.stdout"),
});
var tanya = function (pertanyaan) {
    return new Promise(function (resolve) {
        rl.question(pertanyaan, function (jawaban) {
            resolve(jawaban.trim());
        });
    });
};
// ============================================================================
// 3. [MATERI UAS]: FUNGSI FORMAT RUPIAH
// ============================================================================
function formatRupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}
// ============================================================================
// 4. [MATERI UAS & UTS]: FUNGSI LOGIKA PERHITUNGAN ONGKIR
// Mempertahankan operator, if-else, switch, dan nested conditional dari UTS
// ============================================================================
function hitungKalkulasiOngkir(beratAktual, panjang, lebar, tinggi, jarak, layanan, zona) {
    var tarifPerKg = 0;
    var namaLayanan = "";
    var layananValid = true;
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
    var inputAngkaValid = Number.isFinite(beratAktual) &&
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
    var beratVolumetrik = (panjang * lebar * tinggi) / PEMBAGI_VOLUMETRIK;
    // [MATERI UTS]: IF 2 - Membandingkan berat volumetrik vs berat aktual
    var beratTagihan = 0;
    if (beratVolumetrik > beratAktual) {
        beratTagihan = Math.ceil(beratVolumetrik);
    }
    else {
        beratTagihan = Math.ceil(beratAktual);
    }
    // [MATERI UTS]: EKSPRESI ARITMATIKA - Menghitung ongkir dasar
    var ongkirDasar = beratTagihan * tarifPerKg;
    var biayaTambahan = 0;
    var namaZona = "Non-Surcharge";
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
        }
        else {
            // Berat di bawah 5 kg meskipun jarak > 100 km
            biayaTambahan = 0;
            namaZona = "Tanpa Biaya (Berat < 5kg)";
        }
    }
    else {
        // Jarak <= 100 km
        biayaTambahan = 0;
        namaZona = "Bebas Biaya Zona (Jarak <= 100km)";
    }
    // [MATERI UTS]: OPERATOR PENJUMLAHAN - Total Ongkir
    var totalOngkir = ongkirDasar + biayaTambahan;
    return {
        valid: true,
        beratVolumetrik: beratVolumetrik,
        beratTagihan: beratTagihan,
        tarifPerKg: tarifPerKg,
        namaLayanan: namaLayanan,
        namaZona: namaZona,
        ongkirDasar: ongkirDasar,
        biayaTambahan: biayaTambahan,
        totalOngkir: totalOngkir,
    };
}
// ============================================================================
// 5. [MATERI UAS]: OPERASI CRUD (Create, Read, Update, Delete) & Search
// ============================================================================
// --- CREATE: Tambah Data Pengiriman Baru ---
function menuTambahPengiriman() {
    return __awaiter(this, void 0, void 0, function () {
        var namaPengirim, namaPenerima, beratAktual, _a, panjang, _b, lebar, _c, tinggi, _d, jarak, _e, layanan, zona, hasil, idResi, waktuInput, dataBaru;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log("\n========================================");
                    console.log("       INPUT PENGIRIMAN PAKET BARU      ");
                    console.log("========================================");
                    return [4 /*yield*/, tanya("Nama Pengirim               : ")];
                case 1:
                    namaPengirim = _f.sent();
                    return [4 /*yield*/, tanya("Nama Penerima               : ")];
                case 2:
                    namaPenerima = _f.sent();
                    _a = Number;
                    return [4 /*yield*/, tanya("Berat aktual paket (kg, angka saja)     : ")];
                case 3:
                    beratAktual = _a.apply(void 0, [_f.sent()]);
                    _b = Number;
                    return [4 /*yield*/, tanya("Panjang dimensi (cm, angka saja)        : ")];
                case 4:
                    panjang = _b.apply(void 0, [_f.sent()]);
                    _c = Number;
                    return [4 /*yield*/, tanya("Lebar dimensi (cm, angka saja)          : ")];
                case 5:
                    lebar = _c.apply(void 0, [_f.sent()]);
                    _d = Number;
                    return [4 /*yield*/, tanya("Tinggi dimensi (cm, angka saja)         : ")];
                case 6:
                    tinggi = _d.apply(void 0, [_f.sent()]);
                    _e = Number;
                    return [4 /*yield*/, tanya("Jarak pengiriman (km, angka saja)       : ")];
                case 7:
                    jarak = _e.apply(void 0, [_f.sent()]);
                    console.log("\nPilihan Layanan:");
                    console.log("1. Reguler (3-5 hari kerja)  - Rp5.000/kg");
                    console.log("2. Express (1-2 hari kerja)  - Rp7.000/kg");
                    console.log("3. Overnight (dalam 24 jam)  - Rp9.000/kg");
                    return [4 /*yield*/, tanya("Pilih Layanan (1-3)         : ")];
                case 8:
                    layanan = _f.sent();
                    console.log("\nPilihan Zona Tambahan (jika jarak > 100km & berat >= 5kg):");
                    console.log("1. Zona 1 (0-40 km)   - +Rp3.000");
                    console.log("2. Zona 2 (40-80 km)  - +Rp7.000");
                    console.log("3. Zona 3 (80-120 km) - +Rp11.000");
                    return [4 /*yield*/, tanya("Pilih Zona Pengiriman (1-3) : ")];
                case 9:
                    zona = _f.sent();
                    hasil = hitungKalkulasiOngkir(beratAktual, panjang, lebar, tinggi, jarak, layanan, zona);
                    if (!hasil.valid) {
                        console.log("\nGagal Menyimpan: ".concat(hasil.pesanError));
                        return [2 /*return*/];
                    }
                    idResi = "EXP-".concat(Date.now().toString().slice(-6));
                    waktuInput = new Date().toLocaleString("id-ID");
                    dataBaru = {
                        idResi: idResi,
                        namaPengirim: namaPengirim,
                        namaPenerima: namaPenerima,
                        beratAktual: beratAktual,
                        panjang: panjang,
                        lebar: lebar,
                        tinggi: tinggi,
                        jarak: jarak,
                        layanan: layanan,
                        namaLayanan: hasil.namaLayanan,
                        zona: zona,
                        namaZona: hasil.namaZona,
                        beratVolumetrik: hasil.beratVolumetrik,
                        beratTagihan: hasil.beratTagihan,
                        tarifPerKg: hasil.tarifPerKg,
                        ongkirDasar: hasil.ongkirDasar,
                        biayaTambahan: hasil.biayaTambahan,
                        totalOngkir: hasil.totalOngkir,
                        waktuInput: waktuInput,
                    };
                    // [MATERI UAS]: Menambahkan data ke array dengan method push()
                    databasePengiriman.push(dataBaru);
                    console.log("\n========================================");
                    console.log("          RINCIAN TIKET RESI            ");
                    console.log("========================================");
                    console.log("Nomor Resi        : ".concat(dataBaru.idResi));
                    console.log("Pengirim/Penerima : ".concat(dataBaru.namaPengirim, " \u27A1\uFE0F ").concat(dataBaru.namaPenerima));
                    console.log("Layanan           : ".concat(dataBaru.namaLayanan));
                    console.log("Berat Aktual      : ".concat(dataBaru.beratAktual, " kg"));
                    console.log("Berat Volumetrik  : ".concat(dataBaru.beratVolumetrik.toFixed(2), " kg"));
                    console.log("Berat Tagihan     : ".concat(dataBaru.beratTagihan, " kg"));
                    console.log("Tarif / Kg        : ".concat(formatRupiah(dataBaru.tarifPerKg)));
                    console.log("Ongkir Dasar      : ".concat(formatRupiah(dataBaru.ongkirDasar)));
                    console.log("Biaya Tambahan    : ".concat(formatRupiah(dataBaru.biayaTambahan), " (").concat(dataBaru.namaZona, ")"));
                    console.log("----------------------------------------");
                    console.log("TOTAL ONGKIR      : ".concat(formatRupiah(dataBaru.totalOngkir)));
                    console.log("========================================");
                    console.log(" Data pengiriman paket berhasil disimpan ke sistem!");
                    return [2 /*return*/];
            }
        });
    });
}
// --- READ: Tampilkan Seluruh Data Pengiriman ---
function menuTampilkanSemuaPengiriman() {
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
    console.log("| No | No. Resi   | Pengirim   | Penerima   | Layanan   | Berat Tagih | Jarak (km) | Total Ongkir |");
    console.log("|----+------------+------------+------------+-----------+-------------+------------+--------------|");
    // [MATERI UAS]: PENGULANGAN (LOOP) menggunakan for
    for (var i = 0; i < databasePengiriman.length; i++) {
        var p = databasePengiriman[i];
        var no = (i + 1).toString().padEnd(2, " ");
        var resi = p.idResi.padEnd(10, " ");
        var pengirim = p.namaPengirim.slice(0, 10).padEnd(10, " ");
        var penerima = p.namaPenerima.slice(0, 10).padEnd(10, " ");
        var layanan = p.layanan === "1" ? "Reguler" : p.layanan === "2" ? "Express" : "Overnight";
        var layananPad = layanan.padEnd(9, " ");
        var beratPad = "".concat(p.beratTagihan, " kg").padEnd(11, " ");
        var jarakPad = "".concat(p.jarak).padEnd(10, " ");
        var totalPad = formatRupiah(p.totalOngkir).padEnd(12, " ");
        console.log("| ".concat(no, " | ").concat(resi, " | ").concat(pengirim, " | ").concat(penerima, " | ").concat(layananPad, " | ").concat(beratPad, " | ").concat(jarakPad, " | ").concat(totalPad, " |"));
    }
    console.log("==========================================================================================");
    console.log("Total Paket Terdaftar: ".concat(databasePengiriman.length, " paket."));
}
// --- SEARCH: Cari Paket berdasarkan Resi / Penerima ---
function menuCariPengiriman() {
    return __awaiter(this, void 0, void 0, function () {
        var keyword, hasilCari, _i, databasePengiriman_1, item, _a, hasilCari_1, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("\n========================================");
                    console.log("          PENCARIAN DATA PAKET          ");
                    console.log("========================================");
                    if (databasePengiriman.length === 0) {
                        console.log(" Database masih kosong. Tidak ada data untuk dicari.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tanya("Masukkan No. Resi atau Nama Penerima: ")];
                case 1:
                    keyword = (_b.sent()).toLowerCase();
                    hasilCari = [];
                    for (_i = 0, databasePengiriman_1 = databasePengiriman; _i < databasePengiriman_1.length; _i++) {
                        item = databasePengiriman_1[_i];
                        if (item.idResi.toLowerCase().includes(keyword) ||
                            item.namaPenerima.toLowerCase().includes(keyword) ||
                            item.namaPengirim.toLowerCase().includes(keyword)) {
                            hasilCari.push(item);
                        }
                    }
                    if (hasilCari.length === 0) {
                        console.log(" Data dengan kata kunci \"".concat(keyword, "\" tidak ditemukan."));
                    }
                    else {
                        console.log("\n Ditemukan ".concat(hasilCari.length, " data yang cocok:"));
                        for (_a = 0, hasilCari_1 = hasilCari; _a < hasilCari_1.length; _a++) {
                            data = hasilCari_1[_a];
                            console.log("----------------------------------------");
                            console.log("Resi          : ".concat(data.idResi));
                            console.log("Pengirim      : ".concat(data.namaPengirim));
                            console.log("Penerima      : ".concat(data.namaPenerima));
                            console.log("Layanan       : ".concat(data.namaLayanan));
                            console.log("Jarak & Zona  : ".concat(data.jarak, " km (").concat(data.namaZona, ")"));
                            console.log("Berat Tagihan : ".concat(data.beratTagihan, " kg (Aktual: ").concat(data.beratAktual, "kg, Vol: ").concat(data.beratVolumetrik.toFixed(1), "kg)"));
                            console.log("Total Biaya   : ".concat(formatRupiah(data.totalOngkir)));
                            console.log("Tanggal Input : ".concat(data.waktuInput));
                        }
                        console.log("----------------------------------------");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// --- UPDATE: Ubah Data Paket & Hitung Ulang Ongkir ---
function menuUbahPengiriman() {
    return __awaiter(this, void 0, void 0, function () {
        var resiTarget, indexDitemukan, i, paketLama, inputPengirim, inputPenerima, inputBerat, inputPanjang, inputLebar, inputTinggi, inputJarak, inputLayanan, inputZona, beratAktualBaru, panjangBaru, lebarBaru, tinggiBaru, jarakBaru, layananBaru, zonaBaru, hasilBaru;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n========================================");
                    console.log("       PERBARUI DATA PENGIRIMAN         ");
                    console.log("========================================");
                    if (databasePengiriman.length === 0) {
                        console.log("Database masih kosong.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tanya("Masukkan No. Resi yang ingin diubah: ")];
                case 1:
                    resiTarget = _a.sent();
                    indexDitemukan = -1;
                    for (i = 0; i < databasePengiriman.length; i++) {
                        if (databasePengiriman[i].idResi.toLowerCase() === resiTarget.toLowerCase()) {
                            indexDitemukan = i;
                            break;
                        }
                    }
                    if (indexDitemukan === -1) {
                        console.log(" Paket dengan nomor resi ".concat(resiTarget, " tidak ditemukan."));
                        return [2 /*return*/];
                    }
                    paketLama = databasePengiriman[indexDitemukan];
                    console.log("\nData saat ini untuk resi ".concat(paketLama.idResi, ":"));
                    console.log("Pengirim: ".concat(paketLama.namaPengirim, ", Penerima: ").concat(paketLama.namaPenerima));
                    console.log("Berat: ".concat(paketLama.beratAktual, " kg, Jarak: ").concat(paketLama.jarak, " km, Layanan: ").concat(paketLama.namaLayanan));
                    console.log("Silakan masukkan data baru (tekan Enter langsung jika tidak ingin mengubah):\n");
                    return [4 /*yield*/, tanya("Nama Pengirim baru [".concat(paketLama.namaPengirim, "]: "))];
                case 2:
                    inputPengirim = _a.sent();
                    return [4 /*yield*/, tanya("Nama Penerima baru [".concat(paketLama.namaPenerima, "]: "))];
                case 3:
                    inputPenerima = _a.sent();
                    return [4 /*yield*/, tanya("Berat Aktual (kg) [".concat(paketLama.beratAktual, "]: "))];
                case 4:
                    inputBerat = _a.sent();
                    return [4 /*yield*/, tanya("Panjang (cm) [".concat(paketLama.panjang, "]: "))];
                case 5:
                    inputPanjang = _a.sent();
                    return [4 /*yield*/, tanya("Lebar (cm) [".concat(paketLama.lebar, "]: "))];
                case 6:
                    inputLebar = _a.sent();
                    return [4 /*yield*/, tanya("Tinggi (cm) [".concat(paketLama.tinggi, "]: "))];
                case 7:
                    inputTinggi = _a.sent();
                    return [4 /*yield*/, tanya("Jarak (km) [".concat(paketLama.jarak, "]: "))];
                case 8:
                    inputJarak = _a.sent();
                    return [4 /*yield*/, tanya("Layanan (1-3) [".concat(paketLama.layanan, "]: "))];
                case 9:
                    inputLayanan = _a.sent();
                    return [4 /*yield*/, tanya("Zona (1-3) [".concat(paketLama.zona, "]: "))];
                case 10:
                    inputZona = _a.sent();
                    beratAktualBaru = inputBerat ? Number(inputBerat) : paketLama.beratAktual;
                    panjangBaru = inputPanjang ? Number(inputPanjang) : paketLama.panjang;
                    lebarBaru = inputLebar ? Number(inputLebar) : paketLama.lebar;
                    tinggiBaru = inputTinggi ? Number(inputTinggi) : paketLama.tinggi;
                    jarakBaru = inputJarak ? Number(inputJarak) : paketLama.jarak;
                    layananBaru = inputLayanan ? inputLayanan : paketLama.layanan;
                    zonaBaru = inputZona ? inputZona : paketLama.zona;
                    hasilBaru = hitungKalkulasiOngkir(beratAktualBaru, panjangBaru, lebarBaru, tinggiBaru, jarakBaru, layananBaru, zonaBaru);
                    if (!hasilBaru.valid) {
                        console.log("\n Gagal Update: ".concat(hasilBaru.pesanError));
                        return [2 /*return*/];
                    }
                    // Update object di dalam array
                    databasePengiriman[indexDitemukan] = __assign(__assign({}, paketLama), { namaPengirim: inputPengirim || paketLama.namaPengirim, namaPenerima: inputPenerima || paketLama.namaPenerima, beratAktual: beratAktualBaru, panjang: panjangBaru, lebar: lebarBaru, tinggi: tinggiBaru, jarak: jarakBaru, layanan: layananBaru, zona: zonaBaru, namaLayanan: hasilBaru.namaLayanan, namaZona: hasilBaru.namaZona, beratVolumetrik: hasilBaru.beratVolumetrik, beratTagihan: hasilBaru.beratTagihan, tarifPerKg: hasilBaru.tarifPerKg, ongkirDasar: hasilBaru.ongkirDasar, biayaTambahan: hasilBaru.biayaTambahan, totalOngkir: hasilBaru.totalOngkir });
                    console.log("\n Data resi ".concat(paketLama.idResi, " berhasil diperbarui!"));
                    console.log("Total Ongkir Baru: ".concat(formatRupiah(hasilBaru.totalOngkir)));
                    return [2 /*return*/];
            }
        });
    });
}
// --- DELETE: Hapus Data Pengiriman ---
function menuHapusPengiriman() {
    return __awaiter(this, void 0, void 0, function () {
        var resiHapus, indexHapus, i, konfirmasi, terhapus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n========================================");
                    console.log("         HAPUS DATA PENGIRIMAN          ");
                    console.log("========================================");
                    if (databasePengiriman.length === 0) {
                        console.log(" Database masih kosong.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tanya("Masukkan No. Resi yang ingin dihapus: ")];
                case 1:
                    resiHapus = _a.sent();
                    indexHapus = -1;
                    for (i = 0; i < databasePengiriman.length; i++) {
                        if (databasePengiriman[i].idResi.toLowerCase() === resiHapus.toLowerCase()) {
                            indexHapus = i;
                            break;
                        }
                    }
                    if (indexHapus === -1) {
                        console.log(" Data resi ".concat(resiHapus, " tidak ditemukan."));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tanya("Apakah Anda yakin ingin menghapus data resi ".concat(databasePengiriman[indexHapus].idResi, "? (y/n): "))];
                case 2:
                    konfirmasi = _a.sent();
                    if (konfirmasi.toLowerCase() === "y") {
                        terhapus = databasePengiriman.splice(indexHapus, 1);
                        console.log(" Paket dengan nomor resi ".concat(terhapus[0].idResi, " berhasil dihapus."));
                    }
                    else {
                        console.log("Penghapusan data dibatalkan.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// 6. [MATERI UAS]: MAIN LOOP PROGRAM (WHILE & SWITCH MENU UTAMA)
// ============================================================================
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var berjalan, pilihan, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    berjalan = true;
                    _b.label = 1;
                case 1:
                    if (!berjalan) return [3 /*break*/, 15];
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
                    return [4 /*yield*/, tanya("Pilih Menu (1-6): ")];
                case 2:
                    pilihan = _b.sent();
                    _a = pilihan;
                    switch (_a) {
                        case "1": return [3 /*break*/, 3];
                        case "2": return [3 /*break*/, 5];
                        case "3": return [3 /*break*/, 6];
                        case "4": return [3 /*break*/, 8];
                        case "5": return [3 /*break*/, 10];
                        case "6": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 13];
                case 3: return [4 /*yield*/, menuTambahPengiriman()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 5:
                    menuTampilkanSemuaPengiriman();
                    return [3 /*break*/, 14];
                case 6: return [4 /*yield*/, menuCariPengiriman()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 8: return [4 /*yield*/, menuUbahPengiriman()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, menuHapusPengiriman()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12:
                    console.log("\nTerima kasih telah menggunakan sistem kalkulasi ongkir. Sampai jumpa!");
                    berjalan = false;
                    rl.close();
                    return [3 /*break*/, 14];
                case 13:
                    console.log("Pilihan tidak valid. Silakan pilih menu nomor 1 sampai 6.");
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 1];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// Jalankan program utama
main().catch(function (eror) {
    console.error("Terjadi kesalahan sistem:", eror);
    rl.close();
});
