// sembunyikan form dan notif
$("#form_rincian").hide();
$("#form_resepdokter").hide();
$("#form_pemeriksaanradiologi").hide();
$("#form_pemeriksaanlabpk").hide();
$("#form_soap").hide();
$("#form_sep").hide();
$("#form_berkasdigital").hide();
$("#histori_pelayanan").hide();
$("#notif").hide();
$('#provider').hide();
$('#aturan_pakai').hide();
$("#form_kontrol").hide();

let listObat = [];
let listPemeriksaanRadiologi = [];
let listPemeriksaanLabPK = [];

// tombol buka form diklik
$("#index").on('click', '#bukaform', function(){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  $("#form").show().load(baseURL + '/rawat_jalan/form?t=' + mlite.token);
  $("#bukaform").val("Tutup Form");
  $("#bukaform").attr("id", "tutupform");
});

// tombol tutup form diklik
$("#index").on('click', '#tutupform', function(){
  event.preventDefault();
  $("#form").hide();
  $("#tutupform").val("Buka Form");
  $("#tutupform").attr("id", "bukaform");
});

// tombol batal diklik
$("#form").on("click", "#batal", function(event){
  $("#pasien").hide();
  $('input:text[name=pasien]').val("");
  $('input:text[name=jk]').val("");
  $('input:text[name=stts_daftar]').val("");
  $('input:text[name=no_tlp]').val("");
  $('input:text[name=no_rawat]').removeAttr("disabled", true);
  $('input:text[name=no_reg]').removeAttr("disabled", true);
  bersih();
});

$("#form").on("click","#no_rawat", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/maxid?t=' + mlite.token;
  $.post(url, {
  } ,function(data) {
    $("#no_rawat").val(data);
  });
});

$("#form").on("click","#no_reg", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/maxantrian?t=' + mlite.token;
  var kd_poli = $('select[name=kd_poli]').val();
  var kd_dokter = $('select[name=kd_dokter]').val();

  $.post(url, {
    kd_poli: kd_poli,
    kd_dokter: kd_dokter
  } ,function(data) {
    if(data == '888888') {
      alert('Kuota pendaftaran sudah terpenuhi.\nSilahkan pilih tanggal lain atau pilih dokter lain.');
      $("#no_reg").val();
      $('input:text[name=no_reg]').attr("disabled", true);
    } else if(data == '999999') {
      alert('Kuota pendaftaran sudah terpenuhi.\nSilahkan pilih tanggal lain.');
      $("#no_reg").val();
      $('input:text[name=no_reg]').attr("disabled", true);
    } else {
      $("#no_reg").val(data);
    }
  });
});

$("#form").on("click", "#simpan", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  var no_rawat = $('input:text[name=no_rawat]').val();
  var no_reg = $('input:text[name=no_reg]').val();
  var tgl_registrasi = $('#tgl_registrasi').val();
  var jam_reg = $('#jam_reg').val();
  var no_rkm_medis = $('input:text[name=no_rkm_medis]').val();
  var kd_poli = $('select[name=kd_poli]').val();
  var kd_dokter = $('select[name=kd_dokter]').val();
  var kd_pj = $('select[name=kd_pj]').val();
  var stts_daftar = $('input:hidden[name=stts_daftar]').val();

  var url = baseURL + '/rawat_jalan/save?t=' + mlite.token;

  if(no_rawat == '') {
    alert('Nomor rawat masih kosong!')
  }
  else if(no_reg == '') {
    alert('Nomor antrian masih kosong!')
  }
  else if(no_rkm_medis == '') {
    alert('Data pasien rawat masih kosong! Silahkan pilih pasien.')
  }
  else if(!(stts_daftar == 'Baru' || stts_daftar == 'Lama')) {
    bootbox.alert("Ada tagihan belum diselesaikan. Silahkan hubungi kasir atau admin!");
  } else {
    $.post(url,{
      no_rawat: no_rawat,
      no_reg: no_reg,
      tgl_registrasi: tgl_registrasi,
      jam_reg: jam_reg,
      no_rkm_medis: no_rkm_medis,
      kd_poli: kd_poli,
      kd_dokter: kd_dokter,
      kd_pj: kd_pj,
      stts_daftar: stts_daftar
    },function(data) {
      $("#display").show().load(baseURL + '/rawat_jalan/display?t=' + mlite.token);
      bersih();
      $("#status_pendaftaran").hide();
      $('#notif').html("<div class=\"alert alert-success alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
      "Data pendaftaran rawat jalan telah disimpan!"+
      "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
      "</div>").show();
    }).error(function () {
      $('#notif').html("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
      "Gagal menyimpan data pendaftaran rawat jalan!"+
      "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
      "</div>").show();
    });
  }
  event.preventDefault();
});

$("#display").on("click",".antrian", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var no_rawat = $(this).attr("data-no_rawat");
  window.open(baseURL + '/rawat_jalan/antrian?no_rawat=' + no_rawat + '&t=' + mlite.token);
});

$("#display").on("click",".riwayat_perawatan", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var no_rkm_medis = $(this).attr("data-no_rkm_medis");
  window.open(baseURL + '/pasien/riwayatperawatan/' + no_rkm_medis + '?t=' + mlite.token);
});

// ketika baris data diklik
$("#display").on("click", ".edit", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/form?t=' + mlite.token;
  var no_rawat = $(this).attr("data-no_rawat");
  $.post(url, {no_rawat: no_rawat} ,function(data) {
    // tampilkan data
    $("#form").html(data).show();
    var url    				= baseURL + '/rawat_jalan/statusdaftar?t=' + mlite.token;

    $.post(url, {no_rawat: no_rawat} ,function(data) {
      $("#stts_daftar").html(data).show();
      var get_stts_daftar = $('input:text[name=get_stts_daftar]').val();
      $('input:hidden[name=stts_daftar]').val(get_stts_daftar);
    });
  });
});

// ketika tombol hapus ditekan
$("#form").on("click","#hapus", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/hapus?t=' + mlite.token;
  //var no_rawat = $(this).attr("data-no_rawat");
  var no_rawat = $('input:text[name=no_rawat]').val();

  // tampilkan dialog konfirmasi
  bootbox.confirm("Apakah Anda yakin ingin menghapus data ini?", function(result){
    // ketika ditekan tombol ok
    if (result){
      // mengirimkan perintah penghapusan
      $.post(url, {
        no_rawat: no_rawat
      } ,function(data) {
        // sembunyikan form, tampilkan data yang sudah di perbaharui, tampilkan notif
        $("#display").load(baseURL + '/rawat_jalan/display?t=' + mlite.token);
        bersih();
        $('#notif').html("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
        "Data pasien telah dihapus!"+
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
        "</div>").show();
      });
    }
  });
});

$("#display").on("click", ".sep", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();

  var d = new Date();
  var curr_date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();

  var no_rawat = $(this).attr("data-no_rawat");
  var no_rkm_medis = $(this).attr("data-no_rkm_medis");
  var nm_pasien = $(this).attr("data-nm_pasien");
  var tgl_registrasi = $(this).attr("data-tgl_registrasi");
  var no_peserta = $(this).attr("data-no_peserta");

  var url = baseURL + '/vclaim/bynokartu/' + no_peserta + '/' + curr_date + '?t=' + mlite.token;

  $.get(url,function(data) {
    var data = JSON.parse(data);
    var json_obj = [data];
    if(!json_obj[0]) {
      alert('Koneksi ke server BPJS terputus. Silahkan ulangi lagi!');
    } else if(json_obj[0].metaData.code == 200) {
      $('.nama_peserta').text(json_obj[0].response.peserta.nama);
      $('#no_kartu_peserta').text(json_obj[0].response.peserta.noKartu);
      $('#no_mr_peserta').text(no_rkm_medis);
      $('#nik_peserta').text(json_obj[0].response.peserta.nik);
      $('#tgl_lahir_peserta').text(json_obj[0].response.peserta.tglLahir);
      $('#status_peserta').text(json_obj[0].response.peserta.statusPeserta.keterangan);
      $('#jenis_peserta').text(json_obj[0].response.peserta.jenisPeserta.keterangan);
      $('.prolainis_peserta').text(json_obj[0].response.peserta.informasi.prolanisPRB);

      var jenis_kelamin = 'Laki-Laki';
      if(json_obj[0].response.peserta.sex == 'P') {
        var jenis_kelamin = 'Perempuan';
      }

      $('input:text[name=sep_jenis_kelamin_nama]').val(jenis_kelamin);
      $('input:text[name=sep_jenis_kelamin_kode]').val(json_obj[0].response.peserta.sex);
      $('input:text[name=sep_tanggal_lahir]').val(json_obj[0].response.peserta.tglLahir);
      $('input:text[name=sep_jenis_peserta]').val(json_obj[0].response.peserta.jenisPeserta.keterangan);
      $('input:text[name=sep_no_kartu]').val(json_obj[0].response.peserta.noKartu);
      $('input:text[name=sep_norm]').val(json_obj[0].response.peserta.mr.noMR);
      $('input:text[name=sep_eksekutif_kode]').val("0");
      $('input:text[name=sep_eksekutif_nama]').val("Tidak");
      $('input:text[name=sep_kunjungan_kode]').val("0");
      $('input:text[name=sep_kunjungan_nama]').val("Normal");
      $('input:text[name=sep_cob_kode]').val("0");
      $('input:text[name=sep_cob_nama]').val("Tidak");
      $('input:text[name=sep_katarak_kode]').val("0");
      $('input:text[name=sep_katarak_nama]').val("Tidak");
      $('input:text[name=sep_status_kecelakaan_kode]').val("0");
      $('input:text[name=sep_status_kecelakaan_nama]').val("Tidak");
      $('input:text[name=sep_penjamin_kecelakaan_kode]').val("0");
      $('input:text[name=sep_penjamin_kecelakaan_nama]').val("Tidak");
      $('input:text[name=sep_suplesi_kode]').val("0");
      $('input:text[name=sep_suplesi_nama]').val("Tidak");
      $('input:text[name=sep_kelas_kode]').val(json_obj[0].response.peserta.hakKelas.kode);
      $('input:text[name=sep_kelas_nama]').val(json_obj[0].response.peserta.hakKelas.keterangan);
      $('input:text[name=sep_nomor_telepon]').val(json_obj[0].response.peserta.mr.noTelepon);

    } else {
      alert(json_obj[0].metaData.message);
    }
  });

  $('input:text[name=sep_no_rawat]').val(no_rawat);
  $('input:text[name=no_rkm_medis]').val(no_rkm_medis);
  $('input:text[name=nm_pasien]').val(nm_pasien);
  $('input:text[name=tgl_registrasi]').val(tgl_registrasi);
  $('input:text[name=nomor_asuransi]').val(no_peserta);
  $('input:text[name=no_kartu_pcare]').val(no_peserta);
  $('input:text[name=no_kartu_rs]').val(no_peserta);
  $("#display").hide();
  $("#form_rincian").hide();
  $("#form_resepdokter").hide();
  $("#form_pemeriksaanradiologi").hide();
  $("#form_pemeriksaanlabpk").hide();
  $("#form").hide();
  $("#notif").hide();
  $("#form_soap").hide();
  $("#form_kontrol").hide();
  $("#form_sep").show();
  $("#bukaform").hide();
});

$('#manage').on('click', '#submit_periode_rawat_jalan', function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url    = baseURL + '/rawat_jalan/display?t=' + mlite.token;
  var periode_rawat_jalan  = $('input:text[name=periode_rawat_jalan]').val();
  var periode_rawat_jalan_akhir  = $('input:text[name=periode_rawat_jalan_akhir]').val();

  if(periode_rawat_jalan == '') {
    alert('Tanggal awal masih kosong!')
  }
  if(periode_rawat_jalan_akhir == '') {
    alert('Tanggal akhir masih kosong!')
  }

  $.post(url, {periode_rawat_jalan: periode_rawat_jalan, periode_rawat_jalan_akhir: periode_rawat_jalan_akhir} ,function(data) {
  // tampilkan data
    $("#form").show();
    $("#display").html(data).show();
    $("#form_rincian").hide();
    $("#form_resepdokter").hide();
    $("#form_pemeriksaanradiologi").hide();
    $("#form_pemeriksaanlabpk").hide();
    $("#form_soap").hide();
    $("#form_sep").hide();
    $("#notif").hide();
    $("#rincian").hide();
    $("#sep").hide();
    $("#soap").hide();
    $("#form_kontrol").hide();
    $('.periode_rawat_jalan').datetimepicker('remove');
  });

  event.stopPropagation();

});

$('#manage').on('click', '#belum_periode_rawat_jalan', function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url    = baseURL + '/rawat_jalan/display?t=' + mlite.token;
  var periode_rawat_jalan  = $('input:text[name=periode_rawat_jalan]').val();
  var periode_rawat_jalan_akhir  = $('input:text[name=periode_rawat_jalan_akhir]').val();
  var status_periksa = 'belum';

  if(periode_rawat_jalan == '') {
    alert('Tanggal awal masih kosong!')
  }
  if(periode_rawat_jalan_akhir == '') {
    alert('Tanggal akhir masih kosong!')
  }

  $.post(url, {periode_rawat_jalan: periode_rawat_jalan, periode_rawat_jalan_akhir: periode_rawat_jalan_akhir, status_periksa: status_periksa} ,function(data) {
  // tampilkan data
    $("#form").show();
    $("#display").html(data).show();
    $("#form_rincian").hide();
    $("#form_resepdokter").hide();
    $("#form_pemeriksaanradiologi").hide();
    $("#form_pemeriksaanlabpk").hide();
    $("#form_soap").hide();
    $("#form_sep").hide();
    $("#notif").hide();
    $("#rincian").hide();
    $("#sep").hide();
    $("#soap").hide();
    $("#form_kontrol").hide();
    $('.periode_rawat_jalan').datetimepicker('remove');
  });

  event.stopPropagation();

});

$('#manage').on('click', '#selesai_periode_rawat_jalan', function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url    = baseURL + '/rawat_jalan/display?t=' + mlite.token;
  var periode_rawat_jalan  = $('input:text[name=periode_rawat_jalan]').val();
  var periode_rawat_jalan_akhir  = $('input:text[name=periode_rawat_jalan_akhir]').val();
  var status_periksa = 'selesai';

  if(periode_rawat_jalan == '') {
    alert('Tanggal awal masih kosong!')
  }
  if(periode_rawat_jalan_akhir == '') {
    alert('Tanggal akhir masih kosong!')
  }

  $.post(url, {periode_rawat_jalan: periode_rawat_jalan, periode_rawat_jalan_akhir: periode_rawat_jalan_akhir, status_periksa: status_periksa} ,function(data) {
  // tampilkan data
    $("#form").show();
    $("#display").html(data).show();
    $("#form_rincian").hide();
    $("#form_resepdokter").hide();
    $("#form_pemeriksaanradiologi").hide();
    $("#form_pemeriksaanlabpk").hide();
    $("#form_soap").hide();
    $("#form_sep").hide();
    $("#notif").hide();
    $("#rincian").hide();
    $("#sep").hide();
    $("#soap").hide();
    $("#form_kontrol").hide();
    $('.periode_rawat_jalan').datetimepicker('remove');
  });

  event.stopPropagation();

});

$('#manage').on('click', '#lunas_periode_rawat_jalan', function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url    = baseURL + '/rawat_jalan/display?t=' + mlite.token;
  var periode_rawat_jalan  = $('input:text[name=periode_rawat_jalan]').val();
  var periode_rawat_jalan_akhir  = $('input:text[name=periode_rawat_jalan_akhir]').val();
  var status_periksa = 'lunas';

  if(periode_rawat_jalan == '') {
    alert('Tanggal awal masih kosong!')
  }
  if(periode_rawat_jalan_akhir == '') {
    alert('Tanggal akhir masih kosong!')
  }

  $.post(url, {periode_rawat_jalan: periode_rawat_jalan, periode_rawat_jalan_akhir: periode_rawat_jalan_akhir, status_periksa: status_periksa} ,function(data) {
  // tampilkan data
    $("#form").show();
    $("#display").html(data).show();
    $("#form_rincian").hide();
    $("#form_resepdokter").hide();
    $("#form_pemeriksaanradiologi").hide();
    $("#form_pemeriksaanlabpk").hide();
    $("#form_soap").hide();
    $("#form_sep").hide();
    $("#notif").hide();
    $("#rincian").hide();
    $("#sep").hide();
    $("#soap").hide();
    $("#form_kontrol").hide();
    $('.periode_rawat_jalan').datetimepicker('remove');
  });

  event.stopPropagation();

});

//$("#display").on("click", ".soap", function(event){

// ketika tombol simpan diklik
$("#form_soap").on("click", "#simpan_soap", function(event){
  {if: !$this->core->getPegawaiInfo('nik', $this->core->getUserInfo('username', $_SESSION['mlite_user']))}
    bootbox.alert({
        title: "Pemberitahuan penggunaan!",
        message: "Silahkan login dengan akun non administrator (akun yang berelasi dengan modul kepegawaian)!"
    });
  {else}
    var baseURL = mlite.url + '/' + mlite.admin;
    event.preventDefault();

    var no_rawat        = $('input:text[name=no_rawat]').val();
    var tgl_perawatan   = $('input:text[name=tgl_perawatan]').val();
    var jam_rawat       = $('input:text[name=jam_rawat]').val();
    var suhu_tubuh      = $('input:text[name=suhu_tubuh]').val();
    var tensi           = $('input:text[name=tensi]').val();
    var nadi            = $('input:text[name=nadi]').val();
    var respirasi       = $('input:text[name=respirasi]').val();
    var tinggi          = $('input:text[name=tinggi]').val();
    var berat           = $('input:text[name=berat]').val();
    var gcs             = $('input:text[name=gcs]').val();
    var kesadaran       = $('input:text[name=kesadaran]').val();
    var alergi          = $('input:text[name=alergi]').val();
    var alergi          = $('input:text[name=alergi]').val();
    var lingkar_perut   = $('input:text[name=lingkar_perut]').val();
    var keluhan         = $('textarea[name=keluhan]').val();
    var pemeriksaan     = $('textarea[name=pemeriksaan]').val();
    var penilaian       = $('textarea[name=penilaian]').val();
    var rtl             = $('textarea[name=rtl]').val();
    var instruksi       = $('textarea[name=instruksi]').val();
    var evaluasi        = $('textarea[name=evaluasi]').val();
    var spo2            = $('input:text[name=spo2]').val();

    var url = baseURL + '/rawat_jalan/savesoap?t=' + mlite.token;
    $.post(url, {no_rawat : no_rawat,
    tgl_perawatan: tgl_perawatan,
    jam_rawat: jam_rawat,
    suhu_tubuh : suhu_tubuh,
    tensi : tensi,
    nadi : nadi,
    respirasi : respirasi,
    tinggi : tinggi,
    berat : berat,
    gcs : gcs,
    kesadaran : kesadaran,
    alergi : alergi,
    lingkar_perut: lingkar_perut,
    keluhan : keluhan,
    pemeriksaan : pemeriksaan,
    penilaian : penilaian,
    rtl : rtl,
    instruksi : instruksi,
    evaluasi : evaluasi,
    spo2 : spo2
    }, function(data) {
      // tampilkan data
      $("#display").hide();
      var url = baseURL + '/rawat_jalan/soap?t=' + mlite.token;
      $.post(url, {no_rawat : no_rawat,
      }, function(data) {
        // tampilkan data
        $("#soap").html(data).show();
      });
      $('input:text[name=suhu_tubuh]').val("");
      $('input:text[name=tensi]').val("");
      $('input:text[name=nadi]').val("");
      $('input:text[name=respirasi]').val("");
      $('input:text[name=tinggi]').val("");
      $('input:text[name=berat]').val("");
      $('input:text[name=gcs]').val("");
      $('input:text[name=kesadaran]').val("");
      $('input:text[name=alergi]').val("");
      $('input:text[name=lingkar_perut]').val("");
      $('textarea[name=keluhan]').val("");
      $('textarea[name=pemeriksaan]').val("");
      $('textarea[name=penilaian]').val("");
      $('textarea[name=rtl]').val("");
      $('textarea[name=instruksi]').val("");
      $('textarea[name=evaluasi]').val("");
      $('input:text[name=spo2]').val("");
      $('input:text[name=tgl_perawatan]').val("{?=date('Y-m-d')?}");
      $('input:text[name=tgl_registrasi]').val("{?=date('Y-m-d')?}");
      $('input:text[name=jam_rawat]').val("{?=date('H:i:s')?}");
      $('#notif').html("<div class=\"alert alert-success alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
      "Data soap telah disimpan!"+
      "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
      "</div>").show();
    });
  {/if}
});

// ketika tombol hapus ditekan
$("#soap").on("click",".edit_soap", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var no_rawat        = $(this).attr("data-no_rawat");
  var tgl_perawatan   = $(this).attr("data-tgl_perawatan");
  var jam_rawat       = $(this).attr("data-jam_rawat");
  var suhu_tubuh      = $(this).attr("data-suhu_tubuh");
  var tensi           = $(this).attr("data-tensi");
  var nadi            = $(this).attr("data-nadi");
  var respirasi       = $(this).attr("data-respirasi");
  var tinggi          = $(this).attr("data-tinggi");
  var berat           = $(this).attr("data-berat");
  var gcs             = $(this).attr("data-gcs");
  var kesadaran       = $(this).attr("data-kesadaran");
  var alergi          = $(this).attr("data-alergi");
  var lingkar_perut   = $(this).attr("data-lingkar_perut");
  var keluhan         = $(this).attr("data-keluhan");
  var pemeriksaan     = $(this).attr("data-pemeriksaan");
  var penilaian       = $(this).attr("data-penilaian");
  var rtl             = $(this).attr("data-rtl");
  var instruksi       = $(this).attr("data-instruksi");
  var evaluasi        = $(this).attr("data-evaluasi");
  var spo2            = $(this).attr("data-spo2");

  $('input:text[name=tgl_perawatan]').val(tgl_perawatan);
  $('input:text[name=jam_rawat]').val(jam_rawat);
  $('input:text[name=suhu_tubuh]').val(suhu_tubuh);
  $('input:text[name=tensi]').val(tensi);
  $('input:text[name=nadi]').val(nadi);
  $('input:text[name=respirasi]').val(respirasi);
  $('input:text[name=tinggi]').val(tinggi);
  $('input:text[name=berat]').val(berat);
  $('input:text[name=gcs]').val(gcs);
  $('input:text[name=kesadaran]').val(kesadaran);
  $('input:text[name=alergi]').val(alergi);
  $('input:text[name=lingkar_perut]').val(lingkar_perut);
  $('textarea[name=keluhan]').val(keluhan);
  $('textarea[name=pemeriksaan]').val(pemeriksaan);
  $('textarea[name=penilaian]').val(penilaian);
  $('textarea[name=rtl]').val(rtl);
  $('textarea[name=instruksi]').val(instruksi);
  $('textarea[name=evaluasi]').val(evaluasi);
  $('input:text[name=spo2]').val(spo2);

});

// ketika tombol hapus ditekan
$("#soap").on("click",".hapus_soap", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/hapussoap?t=' + mlite.token;
  var no_rawat = $(this).attr("data-no_rawat");
  var tgl_perawatan = $(this).attr("data-tgl_perawatan");
  var jam_rawat = $(this).attr("data-jam_rawat");

  // tampilkan dialog konfirmasi
  bootbox.confirm("Apakah Anda yakin ingin menghapus data ini?", function(result){
    // ketika ditekan tombol ok
    if (result){
      // mengirimkan perintah penghapusan
      $.post(url, {
        no_rawat: no_rawat,
        tgl_perawatan: tgl_perawatan,
        jam_rawat: jam_rawat
      } ,function(data) {
        var url = baseURL + '/rawat_jalan/soap?t=' + mlite.token;
        $.post(url, {no_rawat : no_rawat,
        }, function(data) {
          // tampilkan data
          $("#soap").html(data).show();
        });
        $('input:text[name=suhu_tubuh]').val("");
        $('input:text[name=tensi]').val("");
        $('input:text[name=nadi]').val("");
        $('input:text[name=respirasi]').val("");
        $('input:text[name=tinggi]').val("");
        $('input:text[name=berat]').val("");
        $('input:text[name=gcs]').val("");
        $('input:text[name=kesadaran]').val("");
        $('input:text[name=alergi]').val("");
        $('input:text[name=lingkar_perut]').val("");
        $('textarea[name=keluhan]').val("");
        $('textarea[name=pemeriksaan]').val("");
        $('textarea[name=penilaian]').val("");
        $('textarea[name=rtl]').val("");
        $('textarea[name=instruksi]').val("");
        $('textarea[name=evaluasi]').val("");
        $('input:text[name=spo2]').val("");
        $('input:text[name=tgl_perawatan]').val("{?=date('Y-m-d')?}");
        $('input:text[name=tgl_registrasi]').val("{?=date('Y-m-d')?}");
        $('input:text[name=jam_rawat]').val("{?=date('H:i:s')?}");
        $('#notif').html("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
        "Data rincian riwayat telah dihapus!"+
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
        "</div>").show();
      });
    }
  });
});

// tombol selesai diklik
$("#form_rincian").on("click", "#selesai", function(event){
  bersih();
  $("#form_berkasdigital").hide();
  $("#form_rincian").hide();
  $("#form_resepdokter").hide();
  $("#form_pemeriksaanradiologi").hide();
  $("#form_pemeriksaanlabpk").hide();
  $("#form_soap").hide();
  $('#resepdokter').hide();
  $('#pemeriksaan_radiologi').hide();
  $("#form").show();
  $("#display").show();
  $("#rincian").hide();
  $("#soap").hide();
  $("#berkasdigital").hide();
  $("#form_kontrol").hide();
  $("#kontrol").hide();
  $("#form_kontrol").hide();
});

// tombol selesai diklik
$("#form_resepdokter").on("click", "#selesai", function(event){
  const no_rawat = $('input:text[name=no_rawat]').val();
  const tgl_perawatan = $('input:text[name=tgl_perawatan]').val();
  const jam_reg = $('input:text[name=jam_reg]').val();

  // send data to server
  var baseURL = mlite.url + '/' + mlite.admin;
  var url = baseURL + '/rawat_jalan/simpanresep?t=' + mlite.token;
  $.ajax({
    url: url,
    type: 'POST',
    data: {
      no_rawat: no_rawat,
      tgl_perawatan: tgl_perawatan,
      jam_reg: jam_reg,
      resep_dokter: listObat,
    },
    success: function(data) {
      console.log(data);
      alert('Data berhasil disimpan');
    },
    error: function(data) {
      console.log(data);
      alert('Data gagal disimpan');
    }
  });

  cleanFormResepDokter();
});

$('#form_pemeriksaanradiologi').on('click', '#selesai', function(event) {
  const no_rawat = $('input:text[name=no_rawat]').val();
  const tgl_permintaan = $('input:text[name=tgl_perawatan]').val();
  const jam_permintaan = $('input:text[name=jam_reg]').val();
  const informasi_tambahan = $('#informasi_tambahan').val();
  const diagnosa_klinis = $('#diagnosa_klinis').val();

  // send data to server
  var baseURL = mlite.url + '/' + mlite.admin;
  var url = baseURL + '/rawat_jalan/simpanpermintaanradiologi?t=' + mlite.token;
  $.ajax({
    url: url,
    type: 'POST',
    data: {
      no_rawat: no_rawat,
      tgl_permintaan: tgl_permintaan,
      jam_permintaan: jam_permintaan,
      informasi_tambahan: informasi_tambahan,
      diagnosa_klinis: diagnosa_klinis,
      permintaan_radiologi: listPemeriksaanRadiologi,
    },
    success: function(data) {
      console.log(data);
      alert('Data berhasil disimpan!');
    },
    error: function(data) {
      console.log(data);
      alert('Data gagal disimpan!');
    }
  });
  cleanFormRadiologi();
});

$('#form_pemeriksaanlabpk').on('click', '#selesai', function(event) {
  const no_rawat = $('input:text[name=no_rawat]').val();
  const informasi_tambahan = $('input:text[name=informasi_tambahan_labpk]').val();
  const diagnosa_klinis = $('input:text[name=diagnosa_klinis_labpk]').val();

  // send data to server
  var baseURL = mlite.url + '/' + mlite.admin;
  var url = baseURL + '/rawat_jalan/simpanpermintaanlabpk?t=' + mlite.token;

  $.ajax({
    url: url,
    type: 'POST',
    data: {
      no_rawat: no_rawat,
      informasi_tambahan: informasi_tambahan,
      diagnosa_klinis: diagnosa_klinis,
      permintaan_lab: listPemeriksaanLabPK,
      permintaan_lab_group: listPemeriksaanLabPK.map(item => item.kd_jenis_prw).filter((value, index, self) => self.indexOf(value) === index),
    },
    success: function(data) {
      alert('Data berhasil disimpan!');
    },
    error: function(data) {
      alert('Data gagal disimpan!');
    }
  });
  cleanFormLabPK();
});

// tombol batal diklik
$("#form_soap").on("click", "#selesai_soap", function(event){
  bersih();
  $("#form_berkasdigital").hide();
  $("#form_rincian").hide();
  $("#form_resepdokter").hide();
  $("#form_pemeriksaanradiologi").hide();
  $("#form_pemeriksaanlabpk").hide();
  $("#form_soap").hide();
  $("#form").show();
  $("#display").show();
  $("#rincian").hide();
  $("#soap").hide();
  $("#berkasdigital").hide();
  $("#form_kontrol").hide();
  $("#kontrol").hide();
  $("#form_kontrol").hide();
});

// tombol batal diklik
$("#form_kontrol").on("click", "#selesai_kontrol", function(event){
  bersih();
  $("#form_berkasdigital").hide();
  $("#form_rincian").hide();
  $("#form_resepdokter").hide();
  $("#form_pemeriksaanradiologi").hide();
  $("#form_pemeriksaanlabpk").hide();
  $("#form_soap").hide();
  $("#form").show();
  $("#display").show();
  $("#rincian").hide();
  $("#soap").hide();
  $("#berkasdigital").hide();
  $("#form_kontrol").hide();
  $("#kontrol").hide();
});

// ketika tombol hapus ditekan
$("#kontrol").on("click",".hapus_kontrol", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/hapuskontrol?t=' + mlite.token;
  var no_reg = $(this).attr("data-no_reg");
  var tanggal_periksa = $(this).attr("data-tanggal_periksa");
  var kd_dokter = $(this).attr("data-kd_dokter");
  var kd_poli = $(this).attr("data-kd_poli");
  var no_rkm_medis = $('input:text[name=no_rkm_medis]').val();
  // tampilkan dialog konfirmasi
  bootbox.confirm("Apakah Anda yakin ingin menghapus data ini?", function(result){
    // ketika ditekan tombol ok
    if (result){
      // mengirimkan perintah penghapusan
      $.post(url, {
        no_reg: no_reg,
        tanggal_periksa: tanggal_periksa,
        kd_dokter: kd_dokter,
        kd_poli: kd_poli,
        no_rkm_medis: no_rkm_medis
      } ,function(data) {
        var url = baseURL + '/rawat_jalan/kontrol?t=' + mlite.token;
        $.post(url, {no_rkm_medis : no_rkm_medis,
        }, function(data) {
          // tampilkan data
          $("#kontrol").html(data).show();
        });
        /*
        $('input:text[name=suhu_tubuh]').val("");
        $('input:text[name=tensi]').val("");
        $('input:text[name=nadi]').val("");
        $('input:text[name=respirasi]').val("");
        $('input:text[name=tinggi]').val("");
        $('input:text[name=berat]').val("");
        $('input:text[name=gcs]').val("");
        $('input:text[name=kesadaran]').val("");
        $('input:text[name=alergi]').val("");
        $('input:text[name=lingkar_perut]').val("");
        $('textarea[name=keluhan]').val("");
        $('textarea[name=pemeriksaan]').val("");
        $('textarea[name=penilaian]').val("");
        $('textarea[name=rtl]').val("");
        $('textarea[name=instruksi]').val("");
        $('input:text[name=tgl_perawatan]').val("{?=date('Y-m-d')?}");
        $('input:text[name=tgl_registrasi]').val("{?=date('Y-m-d')?}");
        $('input:text[name=jam_rawat]').val("{?=date('H:i:s')?}");
        */
        $('#notif').html("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
        "Data rincian riwayat telah dihapus!"+
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
        "</div>").show();
      });
    }
  });
});

// ketika inputbox pencarian diisi
$('input:text[name=layanan]').on('input',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/layanan?t=' + mlite.token;
  var layanan = $('input:text[name=layanan]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();

  if(layanan!="") {
      $.post(url, {layanan: layanan, no_rawat: no_rawat} ,function(data) {
      // tampilkan data yang sudah di perbaharui
        $("#layanan").html(data).show();
        $("#obat").hide();
      });
  }
});
// end pencarian

// ketika baris data diklik
$("#layanan").on("click", ".pilih_layanan", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();

  var kd_jenis_prw = $(this).attr("data-kd_jenis_prw");
  var nm_perawatan = $(this).attr("data-nm_perawatan");
  var biaya = $(this).attr("data-biaya");
  var kat = $(this).attr("data-kat");

  $('input:hidden[name=kd_jenis_prw]').val(kd_jenis_prw);
  $('input:text[name=nm_perawatan]').val(nm_perawatan);
  $('input:text[name=biaya]').val(biaya);
  $('input:hidden[name=kat]').val(kat);

  $("#layanan").hide();
  $('#provider').show();
  $('#aturan_pakai').hide();
  $("#form_kontrol").hide();
});

// ketika inputbox pencarian diisi
$('input:text[name=namaobat]').on('input',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/obat?t=' + mlite.token;
  var namaobat = $('input:text[name=namaobat]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();

  if(namaobat!="") {
      $.post(url, {namaobat: namaobat, no_rawat: no_rawat} ,function(data) {
      // tampilkan data yang sudah di perbaharui
        $("#listobat").html(data).show();
        $("#obat").hide();
      });
  }
});
// end pencarian

$('input:text[name=namapemeriksaanradiologi]').on('input',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/perawatanradiologi?t=' + mlite.token;
  var namapemeriksaanradiologi = $('input:text[name=namapemeriksaanradiologi]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();

  if(namapemeriksaanradiologi!="") {
      $.post(url, {namapemeriksaanradiologi: namapemeriksaanradiologi, no_rawat: no_rawat} ,function(data) {
        // tampilkan data yang sudah di perbaharui
        $("#listpemeriksaanradiologi").html(data).show();
      });
  }
});

$('input:text[name=namapemeriksaanradiologi]').on('click',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/perawatanradiologi?t=' + mlite.token;
  var namapemeriksaanradiologi = $('input:text[name=namapemeriksaanradiologi]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();

  $.post(url, {namapemeriksaanradiologi: namapemeriksaanradiologi, no_rawat: no_rawat} ,function(data) {
    $("#listpemeriksaanradiologi").html(data).show();
  });
  
});

$('input:text[name=pemeriksaan-pk]').on('input',function(e){
  console.log('test');
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/perawatanlabpk?t=' + mlite.token;
  var namapemeriksaanlabpk = $('input:text[name=pemeriksaan-pk]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();

  if(namapemeriksaanlabpk!="") {
      $.post(url, {namapemeriksaanlabpk: namapemeriksaanlabpk, no_rawat: no_rawat} ,function(data) {
        $("#listpemeriksaanlabpk").html(data).show();
      });
  }
  $("#listdetailpemeriksaanlabpk").hide();
});

$('input:text[name=pemeriksaan-pk]').on('click',function(e){
  console.log('test');
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/perawatanlabpk?t=' + mlite.token;
  var namapemeriksaanlabpk = $('input:text[name=pemeriksaan-pk]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();

  $.post(url, {namapemeriksaanlabpk: namapemeriksaanlabpk, no_rawat: no_rawat} ,function(data) {
    $("#listpemeriksaanlabpk").html(data).show();
  });
  $("#listdetailpemeriksaanlabpk").hide();
});

$('input:text[name=detail-pemeriksaan-pk]').on('input',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/detailperawatanlabpk?t=' + mlite.token;
  var namapemeriksaanlabpk = $('input:text[name=detail-pemeriksaan-pk]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();
  var kd_jenis_prw = $('input:hidden[name=kd_jenis_prw]').val();

  if(namapemeriksaanlabpk!="") {
      $.post(url, {namapemeriksaanlabpk: namapemeriksaanlabpk, no_rawat: no_rawat, kd_jenis_prw: kd_jenis_prw} ,function(data) {
        $("#listdetailpemeriksaanlabpk").html(data).show();
      });
  }
});
// check on text click
$('input:text[name=detail-pemeriksaan-pk]').on('click',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/detailperawatanlabpk?t=' + mlite.token;
  var namapemeriksaanlabpk = $('input:text[name=detail-pemeriksaan-pk]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();
  var kd_jenis_prw = $('input:hidden[name=kd_jenis_prw]').val();

  $.post(url, {namapemeriksaanlabpk: namapemeriksaanlabpk, no_rawat: no_rawat, kd_jenis_prw: kd_jenis_prw} ,function(data) {
  // tampilkan data yang sudah di perbaharui
    $("#listdetailpemeriksaanlabpk").html(data).show();
  });
});

// check if press backspace or delete on detail-pemeriksaan-pk
$('input:text[name=detail-pemeriksaan-pk]').on('keydown',function(e){
  var baseURL = mlite.url + '/' + mlite.admin;
  var url    = baseURL + '/rawat_jalan/detailperawatanlabpk?t=' + mlite.token;
  var namapemeriksaanlabpk = $('input:text[name=detail-pemeriksaan-pk]').val();
  var no_rawat = $('input:text[name=no_rawat]').val();
  var kd_jenis_prw = $('input:hidden[name=kd_jenis_prw]').val();

  if(e.keyCode == 8 || e.keyCode == 46) {
    $.post(url, {namapemeriksaanlabpk: namapemeriksaanlabpk, no_rawat: no_rawat, kd_jenis_prw: kd_jenis_prw} ,function(data) {
    // tampilkan data yang sudah di perbaharui
      $("#listdetailpemeriksaanlabpk").html(data).show();
    });
  }
});

$("#listobat").on("click", ".pilih_listobat", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();

  var kode_brng = $(this).attr("data-kode_brng");
  var nama_brng = $(this).attr("data-nama_brng");
  var ralan = $(this).attr("data-ralan");
  var kat = $(this).attr("data-kat");

  $('input:hidden[name=kode_brng]').val(kode_brng);
  $('input:text[name=nama_brng]').val(nama_brng);
  $('input:text[name=ralan]').val(ralan);
  $('input:hidden[name=kat]').val(kat);

  $("#listobat").hide();
  $('#provider').show();
  $('#aturan_pakai').hide();
  $("#form_kontrol").hide();
});

$("#listpemeriksaanradiologi").on("click", ".pilih_listpemeriksaanradiologi", function(event){
  event.preventDefault();

  var kd_jenis_prw = $(this).attr("data-kd_jenis_prw");
  var nm_perawatan = $(this).attr("data-nm_perawatan");
  var biaya = $(this).attr("data-total_byr");

  $('input:hidden[name=kd_jenis_prw]').val(kd_jenis_prw);
  $('input:text[name=nm_perawatan]').val(nm_perawatan);
  $('input:text[name=biaya]').val(biaya);

  $("#listpemeriksaanradiologi").hide();
  $('#provider').show();
  $('#aturan_pakai').hide();
  $("#form_kontrol").hide();
});

$("#listpemeriksaanlabpk").on("click", ".pilih_listpemeriksaanlabpk", function(event){
  event.preventDefault();

  $('input:hidden[name=kd_jenis_prw]').val($(this).attr("data-kd_jenis_prw"));
  $('input:text[name=pemeriksaan-pk]').val($(this).attr("data-nm_perawatan"));
  $('input:text[name=nm_perawatan]').val($(this).attr("data-nm_perawatan"));

  $("#listpemeriksaanlabpk").hide();
  $('#provider').show();
  $('#aturan_pakai').hide();
  $("#form_kontrol").hide();
});

$("#listdetailpemeriksaanlabpk").on("click", ".pilih_listdetailpemeriksaanlabpk", function(event){
  event.preventDefault();
  
  var kd_jenis_prw = $(this).attr("data-kd_jenis_prw");
  var id_template = $(this).attr("data-id_template");
  var nm_detail_perawatan = $(this).attr("data-nm_perawatan");
  var biaya_item = $(this).attr("data-biaya_item");

  $('input:hidden[name=kd_jenis_prw]').val(kd_jenis_prw);
  $('input:hidden[name=id_template]').val(id_template);
  $('input:text[name=nm_detail_perawatan]').val(nm_detail_perawatan);
  $('input:text[name=biaya_item]').val(biaya_item);

  $("#listdetailpemeriksaanlabpk").hide();
  $('#provider').show();
  $('#aturan_pakai').hide();
  $("#form_kontrol").hide();
});



// ketika tombol panggil ditekan
// $("#display").on("click",".panggil", function(event){
//   event.preventDefault();

//   var nm_pasien 	= $(this).attr("data-nm_pasien");
//   var nm_poli = $(this).attr("data-nm_poli");
//   var no_reg = $(this).attr("data-no_reg");
//   function play (){
//     responsiveVoice.speak(
//       nm_pasien + ", nomor antrian " + no_reg + ", ke " + nm_poli ,"Indonesian Male", {pitch: 1,rate: 0.8,volume: 2}
//     );
//   }
//   play();

// });
$("#display").on("click",".panggilnomor", function(event){
  event.preventDefault();

  var nm_pasien 	= $(this).attr("data-nm_pasien");
  var nm_poli = $(this).attr("data-nm_poli");
  var no_reg = $(this).attr("data-no_reg");
  // nm_pasien + ", nomor antrian " + no_reg + ", ke " + nm_poli ,"Indonesian Male", {pitch: 1,rate: 0.8,volume: 2}

  function play (){
    responsiveVoice.speak(
      nm_pasien + ", nomor antrian " + no_reg + ", ke " + nm_poli ,"Indonesian Male", {pitch: 1,rate: 0.8,volume: 2}
    );
  }
  play();
});

$("#display").on("click",".panggilnama", function(event){
  event.preventDefault();

  var nm_pasien 	= $(this).attr("data-nm_pasien");
  var nm_poli = $(this).attr("data-nm_poli");
  // nm_pasien + ", nomor antrian " + no_reg + ", ke " + nm_poli ,"Indonesian Male", {pitch: 1,rate: 0.8,volume: 2}

  function play (){
    responsiveVoice.speak(
      nm_pasien + ", ke " + nm_poli ,"Indonesian Male", {pitch: 1,rate: 0.8,volume: 2}
    );
  }
  play();
});

// akhir kode panggil

// ketika tombol simpan diklik
$("#form_rincian").on("click", "#simpan_rincian", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();

  var no_rawat        = $('input:text[name=no_rawat]').val();
  var kd_jenis_prw 	  = $('input:hidden[name=kd_jenis_prw]').val();
  var provider        = $('select[name=provider]').val();
  var kode_provider   = $('input:text[name=kode_provider]').val();
  var kode_provider2   = $('input:text[name=kode_provider2]').val();
  var tgl_perawatan   = $('input:text[name=tgl_perawatan]').val();
  var jam_rawat       = $('input:text[name=jam_rawat]').val();
  var biaya           = $('input:text[name=biaya]').val();
  var aturan_pakai    = $('input:text[name=aturan_pakai]').val();
  var kat             = $('input:hidden[name=kat]').val();
  var jml             = $('input:text[name=jml]').val();

  var url = baseURL + '/rawat_jalan/savedetail?t=' + mlite.token;
  $.post(url, {no_rawat : no_rawat,
  kd_jenis_prw   : kd_jenis_prw,
  provider       : provider,
  kode_provider  : kode_provider,
  kode_provider2 : kode_provider2,
  tgl_perawatan  : tgl_perawatan,
  jam_rawat      : jam_rawat,
  biaya          : biaya,
  aturan_pakai   : aturan_pakai,
  kat            : kat,
  jml            : jml
  }, function(data) {

    // tampilkan data
    $("#display").hide();
    var url = baseURL + '/rawat_jalan/rincian?t=' + mlite.token;
    $.post(url, {no_rawat : no_rawat,
    }, function(data) {
      // tampilkan data
      $("#rincian").html(data).show();
    });
    $('input:hidden[name=kd_jenis_prw]').val("");
    $('input:text[name=nm_perawatan]').val("");
    $('input:hidden[name=kat]').val("");
    $('input:text[name=biaya]').val("");
    $('input:text[name=nama_provider]').val("");
    $('input:text[name=nama_provider2]').val("");
    $('input:text[name=kode_provider]').val("");
    $('input:text[name=kode_provider2]').val("");
    $('#notif').html("<div class=\"alert alert-success alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
    "Data pasien telah disimpan!"+
    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
    "</div>").show();
  });
});

$("#form_resepdokter").on("click", "#simpan_resep", function(event){

  var kode_brng = $('input:hidden[name=kode_brng]').val();
  var nama_brng = $('input:text[name=nama_brng]').val();
  var jml = $('input:text[name=jml]').val();
  var aturan = $('input:text[name=aturan]').val();
  var ralan = $('input:text[name=ralan]').val();
  var subtotal = ralan * jml;

  const obat ={
    kode_brng: kode_brng,
    jml: jml,
    aturan_pakai: aturan,
    subtotal: subtotal
  };

  listObat.push(obat);
  const totalBayar = listObat.reduce((total, obat) => total + obat.subtotal, 0);

  // show total on total-harga-resep
  $('#total-harga-resep').html(totalBayar);

  $('#body-list-resep').append(`
    <tr>
      <td>${nama_brng}</td>
      <td>${aturan}</td>
      <td>${jml}</td>
      <td>${subtotal}</td>
      <td><button class="btn btn-danger hapus_resep" data-kode_brng="${$('input:hidden[name=kode_brng]').val()}">Hapus</button></td>
    </tr>
  `);

  // reset input
  $('input:hidden[name=kode_brng]').val("");
  $('input:text[name=nama_brng]').val("");
  $('input:text[name=jml]').val("");
  $('input:text[name=aturan]').val("-");
  $('input:text[name=ralan]').val("");
  $('input:text[name=namaobat]').val("");
});

$("#form_resepdokter").on("click", "#batal", function(event){
  cleanFormResepDokter();
});

$("#form_pemeriksaanradiologi").on("click", "#simpan_rincian_pemeriksaan_radiologi", function(event){
  var no_rawat = $('input:hidden[name=no_rawat]').val();
  var tgl_periksa = $('input:text[name=tgl_periksa]').val();
  var jam = $('input:text[name=jam]').val();
  var kd_jenis_prw = $('input:hidden[name=kd_jenis_prw]').val();
  var nm_perawatan = $('input:text[name=nm_perawatan]').val();
  var biaya = $('input:text[name=biaya]').val();

  const pemeriksaan = {
    no_rawat: no_rawat,
    tgl_periksa: tgl_periksa,
    jam: jam,
    kd_jenis_prw: kd_jenis_prw,
    nm_perawatan: nm_perawatan,
    biaya: biaya
  };

  listPemeriksaanRadiologi.push(pemeriksaan);

  const totalBayar = listPemeriksaanRadiologi.reduce((total, pemeriksaan) => total + parseInt(pemeriksaan.biaya), 0);

  // show total on total-harga-resep  
  $('#total-biaya-pemeriksaan-radiologi').html(totalBayar);

  $('#body-list-pemeriksaan-radiologi').append(`
    <tr>
      <td>${kd_jenis_prw}</td>
      <td>${nm_perawatan}</td>
      <td>${biaya}</td>
      <td><button class="btn btn-danger hapus_detail" data-kd_jenis_prw="${$('input:hidden[name=kd_jenis_prw]').val()}">Hapus</button></td>
    </tr>
  `);

  // reset input
  $('input:hidden[name=kd_jenis_prw]').val("");
  $('input:text[name=nm_perawatan]').val("");
  $('input:text[name=biaya]').val("");
  $('input:text[name=namapemeriksaanradiologi]').val("");
});

$("#form_pemeriksaanradiologi").on("click", "#batal", function(event){
  cleanFormRadiologi();
});

$("#form_pemeriksaanlabpk").on("click", "#simpan_rincian_pemeriksaan_labpk", function(event){
  var no_rawat = $('input:hidden[name=no_rawat]').val();
  // var tgl_periksa = $('input:text[name=tgl_periksa]').val();
  // var jam = $('input:text[name=jam]').val();
  var kd_jenis_prw = $('input:hidden[name=kd_jenis_prw]').val();
  var id_template = $('input:hidden[name=id_template]').val();
  var nm_perawatan = $('input:text[name=nm_perawatan]').val();
  var nm_detail_perawatan = $('input:text[name=nm_detail_perawatan]').val();
  var biaya_item = $('input:text[name=biaya_item]').val();

  const pemeriksaan = {
    no_rawat: no_rawat,
    // tgl_periksa: tgl_periksa,
    // jam: jam,
    kd_jenis_prw: kd_jenis_prw,
    id_template: id_template,
    nm_perawatan: nm_perawatan,
    nm_detail_perawatan: nm_detail_perawatan,
    biaya_item: biaya_item
  };

  listPemeriksaanLabPK.push(pemeriksaan);
  console.log("=========");
  console.log(id_template);
  console.log("=========");

  const totalBayar = listPemeriksaanLabPK.reduce((total, pemeriksaan) => total + parseInt(pemeriksaan.biaya_item), 0);

  // show total on total-harga-resep
  $('#total-biaya-pemeriksaan-labpk').html(totalBayar);

  $('#body-list-pemeriksaan-labpk').append(`
    <tr>
      <td>${kd_jenis_prw}</td>
      <td>${nm_perawatan}</td>
      <td>${nm_detail_perawatan}</td>
      <td>${biaya_item}</td>
      <td><button class="btn btn-danger hapus_detail" data-id_template="${$('input:hidden[name=id_template]').val()}">Hapus</button></td>
    </tr>
  `);

  // reset input
  // $('input:hidden[name=kd_jenis_prw]').val("");
  // $('input:text[name=nm_perawatan]').val("");
  $('input:text[name=nm_detail_perawatan]').val("");
  $('input:text[name=biaya_item]').val("");
  $('input:text[name=namapemeriksaanlabpk]').val("");
});

$("#form_pemeriksaanlabpk").on("click", "#batal", function(event){
  cleanFormLabPK();
});

$('#resepdokter').on("click",".hapus_resep", function(event){
  event.preventDefault();
  const kode_brng = $(this).attr("data-kode_brng");
  const index = listObat.findIndex(obat => obat.kode_brng === kode_brng);
  listObat.splice(index, 1);
  // remove component from table
  $(this).parent().parent().remove();
  // show total on total-harga-resep
  $('#total-harga-resep').html(listObat.reduce((total, obat) => total + obat.subtotal, 0));
});

$('#pemeriksaan_radiologi').on("click",".hapus_detail", function(event){
  event.preventDefault();
  const kd_jenis_prw = $(this).attr("data-kd_jenis_prw");
  const index = listPemeriksaanRadiologi.findIndex(pemeriksaan => pemeriksaan.kd_jenis_prw === kd_jenis_prw);
  listPemeriksaanRadiologi.splice(index, 1);
  // remove component from table
  $(this).parent().parent().remove();
  // show total on total-harga-resep
  $('#total-biaya-pemeriksaan-radiologi').html(listPemeriksaanRadiologi.reduce((total, pemeriksaan) => total + parseInt(pemeriksaan.biaya), 0));
});

$('#pemeriksaan_lab_pk').on("click",".hapus_detail", function(event){
  event.preventDefault();
  const id_template = $(this).attr("data-id_template");
  console.log(id_template);
  const index = listPemeriksaanLabPK.findIndex(pemeriksaan => pemeriksaan.id_template === id_template);
  listPemeriksaanLabPK.splice(index, 1);
  // remove component from table
  $(this).parent().parent().remove();
  // show total on total-harga-resep
  $('#total-biaya-pemeriksaan-labpk').html(listPemeriksaanLabPK.reduce((total, pemeriksaan) => total + parseInt(pemeriksaan.biaya_item), 0));
});

// ketika tombol hapus ditekan
$("#rincian").on("click",".hapus_detail", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var url = baseURL + '/rawat_jalan/hapusdetail?t=' + mlite.token;
  var no_rawat = $(this).attr("data-no_rawat");
  var kd_jenis_prw = $(this).attr("data-kd_jenis_prw");
  var tgl_perawatan = $(this).attr("data-tgl_perawatan");
  var jam_rawat = $(this).attr("data-jam_rawat");
  var provider = $(this).attr("data-provider");

  // tampilkan dialog konfirmasi
  bootbox.confirm("Apakah Anda yakin ingin menghapus data ini?", function(result){
    // ketika ditekan tombol ok
    if (result){
      // mengirimkan perintah penghapusan
      $.post(url, {
        no_rawat: no_rawat,
        kd_jenis_prw: kd_jenis_prw,
        tgl_perawatan: tgl_perawatan,
        jam_rawat: jam_rawat,
        provider: provider
      } ,function(data) {
        var url = baseURL + '/rawat_jalan/rincian?t=' + mlite.token;
        $.post(url, {no_rawat : no_rawat,
        }, function(data) {
          // tampilkan data
          $("#rincian").html(data).show();
        });
        $('#notif').html("<div class=\"alert alert-danger alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
        "Data rincian rawat jalan telah dihapus!"+
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
        "</div>").show();
      });
    }
  });
});

// ketika tombol simpan diklik
$("#form_kontrol").on("click", "#simpan_kontrol", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();

  var no_rkm_medis    = $('input:text[name=no_rkm_medis]').val();
  var no_rawat        = $('input:text[name=no_rawat]').val();
  var tanggal_rujukan = $('input:text[name=tanggal_rujukan]').val();
  var tanggal_datang  = $('input:text[name=tanggal_datang]').val();
  var diagnosa        = $('input:text[name=diagnosa]').val();
  var terapi          = $('input:text[name=terapi]').val();
  var alasan1         = $('textarea[name=alasan1]').val();
  var rtl1            = $('textarea[name=rtl1]').val();
  var poli            = $('select[name=poli]').val();
  var dokter          = $('select[name=dokter]').val();

  var url = baseURL + '/rawat_jalan/savekontrol?t=' + mlite.token;
  $.post(url, {no_rawat : no_rawat,
  no_rkm_medis   : no_rkm_medis,
  tanggal_rujukan       : tanggal_rujukan,
  tanggal_datang  : tanggal_datang,
  diagnosa : diagnosa,
  terapi  : terapi,
  alasan1      : alasan1,
  rtl1          : rtl1,
  dokter : dokter,
  poli : poli
  }, function(data) {
    // tampilkan data
    $("#display").hide();
    var url = baseURL + '/rawat_jalan/kontrol?t=' + mlite.token;
    $.post(url, {no_rkm_medis : no_rkm_medis,
    }, function(data) {
      // tampilkan data
      $("#kontrol").html(data).show();
    });
    $('input:text[name=nm_perawatan]').val("");
    $('input:text[name=biaya]').val("");
    $('input:text[name=diagnosa_klinis]').val("");
    $('input:text[name=nama_provider]').val("");
    $('input:text[name=nama_provider2]').val("");
    $('input:text[name=kode_provider]').val("");
    $('input:text[name=kode_provider2]').val("");
    $('input:text[name=racikan]').val("");
    $('input:text[name=nama_racik]').val("");
    $('#notif').html("<div class=\"alert alert-success alert-dismissible fade in\" role=\"alert\" style=\"border-radius:0px;margin-top:-15px;\">"+
    "Data surat kontrol telah disimpan!"+
    "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times;</button>"+
    "</div>").show();
  });
});

function bersih(){
  $('input:text[name=no_rawat]').val("");
  $('input:text[name=no_rkm_medis]').val("");
  $('input:text[name=nm_pasien]').val("");
  $('input:text[name=tgl_perawatan]').val("{?=date('Y-m-d')?}");
  $('input:text[name=tgl_registrasi]').val("{?=date('Y-m-d')?}");
  $('input:text[name=tgl_lahir]').val("");
  $('input:text[name=jenis_kelamin]').val("");
  $('input:text[name=alamat]').val("");
  $('input:text[name=telepon]').val("");
  $('input:text[name=pekerjaan]').val("");
  $('input:text[name=layanan]').val("");
  $('input:text[name=obat]').val("");
  $('input:text[name=nama_jenis]').val("");
  $('input:text[name=jumlah_jual]').attr("disabled", true);
  $('input:text[name=potongan]').attr("disabled", true);
  $('input:text[name=harga_jual]').val("");
  $('input:text[name=total]').val("");
  $('input:text[name=no_reg]').val("");
}

function cleanFormLabPK(){
  bersih();
  console.log("batal");
  $('input:hidden[name=kd_jenis_prw]').val("");
  $('input:text[name=nm_perawatan]').val("");
  $('input:text[name=biaya]').val("");
  $('input:text[name=namapemeriksaanlab]').val("");
  $('input:text[name=pemeriksaan-pk]').val("");
  $('input:text[name=detail-pemeriksaan-pk]').val("");
  $('input:text[name=informasi_tambahan_labpk]').val("");
  $('input:text[name=diagnosa_klinis_labpk]').val("");
  $('input:text[name=nm_detail_perawatan]').val("");
  $("#form_pemeriksaanlabpk").hide();
  $("#pemeriksaan_lab_pk").hide();
  $("#listpemeriksaanlabpk").hide();
  $('#listdetailpemeriksaanlabpk').hide();
  $("#form").show();
  $("#display").show();
  $("#form_kontrol").hide();
  $("#kontrol").hide();
  listPemeriksaanLabPK = [];
}

function cleanFormRadiologi(){
  bersih();
  console.log("batal");
  $('input:text[name=namapemeriksaanradiologi]').val("");
  $('input:text[name=informasi_tambahan]').val("");
  $('input:text[name=diagnosa_klinis]').val("");
  $('input:text[name=nm_perawatan]').val("");
  $('input:text[name=biaya]').val("");
  $("#form_rincian").hide();
  $("#form_pemeriksaanradiologi").hide();
  $("#form").show();
  $("#display").show();
  $("#rincian").hide();
  $('#pemeriksaan_radiologi').hide();
  $("#kontrol").hide();
  listPemeriksaanRadiologi = [];
}

function cleanFormResepDokter(){
  bersih();
  console.log("batal");
  $('input:text[name=namaobat]').val("");
  $('input:text[name=nama_brng]').val("");
  $('input:text[name=ralan]').val("");
  $('input:text[name=aturan]').val("");
  $('input:text[name=jml]').val("");

  $("#form_rincian").hide();
  $("#form_resepdokter").hide();
  $("#form").show();
  $("#display").show();
  $("#rincian").hide();
  $("#resepdokter").hide();
  $("#kontrol").hide();
  $("#form_kontrol").hide();
  listObat = [];
}


$(document).click(function (event) {
    $('.dropdown-menu[data-parent]').hide();
});

$(document).on('click', '.table-responsive [data-toggle="dropdown"]', function () {
    if ($('body').hasClass('modal-open')) {
        throw new Error("This solution is not working inside a responsive table inside a modal, you need to find out a way to calculate the modal Z-index and add it to the element")
        return true;
    }

    $buttonGroup = $(this).parent();
    if (!$buttonGroup.attr('data-attachedUl')) {
        var ts = +new Date;
        $ul = $(this).siblings('ul');
        $ul.attr('data-parent', ts);
        $buttonGroup.attr('data-attachedUl', ts);
        $(window).resize(function () {
            $ul.css('display', 'none').data('top');
        });
    } else {
        $ul = $('[data-parent=' + $buttonGroup.attr('data-attachedUl') + ']');
    }
    if (!$buttonGroup.hasClass('open')) {
        $ul.css('display', 'none');
        return;
    }
    dropDownFixPosition($(this).parent(), $ul);
    function dropDownFixPosition(button, dropdown) {
        var dropDownTop = button.offset().top + button.outerHeight();
        dropdown.css('top', dropDownTop-60 + "px");
        dropdown.css('left', button.offset().left+7 + "px");
        dropdown.css('position', "absolute");

        dropdown.css('width', dropdown.width());
        dropdown.css('heigt', dropdown.height());
        dropdown.css('display', 'block');
        dropdown.appendTo('body');
    }
});

$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});

$("#form").on("click","#jam_reg", function(event){
    var baseURL = mlite.url + '/' + mlite.admin;
    var url = baseURL + '/rawat_jalan/cekwaktu?t=' + mlite.token;
    $.post(url, {
    } ,function(data) {
      $("#jam_reg").val(data);
    });
});

$("#form_soap").on("click","#jam_rawat", function(event){
    var baseURL = mlite.url + '/' + mlite.admin;
    var url = baseURL + '/rawat_jalan/cekwaktu?t=' + mlite.token;
    $.post(url, {
    } ,function(data) {
      $("#jam_rawat").val(data);
    });
});

$("#form_soap").on("click","#odontogram", function(event){
  var baseURL = mlite.url + '/' + mlite.admin;
  event.preventDefault();
  var id_pasien = $('input:text[name=no_rkm_medis]').val();
  var loadURL =  baseURL + '/rawat_jalan/odontogram/' + id_pasien + '?t=' + mlite.token;

  var modal = $('#odontogramModal');
  var modalContent = $('#odontogramModal .modal-content');

  modal.off('show.bs.modal');
  modal.on('show.bs.modal', function () {
      modalContent.load(loadURL);
  }).modal();
  return false;
});
