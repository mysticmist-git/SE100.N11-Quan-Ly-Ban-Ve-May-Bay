import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    showToast,
    dateIsValid,
    onlyNumber,
    validateEmail,
    onlyEnglish,
} from '../start.js';
window.onlyNumber = onlyNumber;

var MaNguoiLon = '3';
var MaTreEm = '2';
var MaEmBe = '1';
//Lấy gói đặt từ Tóm tắt trước đặt
let PackageBooking;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    PackageBooking = JSON.parse(document.getElementById('PackageBookingJS').getAttribute('PackageBookingJS'));
    closeLoader();
    console.log(PackageBooking);

    if (PackageBooking) {
        axios({
            method: 'post',
            url: '/hoadon/XoaCookieMaHangVe',
        }).then((res) => {
            PackageBooking.HoaDon.NgayGioDat = new Date().toLocaleString();
            AddEventHanhKhach_Item();
            NguoiLienHe_Input_Change();
            AddEventHanhLy_Modal();
            TienNghiChuyenBay();
            TiepTucTren_Onclick();
            TomTat_func();
        });
    }
}
if (!PackageBooking) GetPackageBooing_fromSV();

// Thêm các event cho các HanhKhach_Item
function AddEventHanhKhach_Item() {
    const HanhKhach_Items = document.querySelectorAll('.HanhKhach_Item');
    for (let i = 0; i < HanhKhach_Items.length; i++) {
        // Giới tính
        const DanhXung_lis = HanhKhach_Items[i].querySelectorAll('.DanhXung_li');
        for (let j = 0; j < DanhXung_lis.length; j++) {
            DanhXung_lis[j].addEventListener('click', (e) => {
                const HanhKhach_Item_GioiTinh = e.target
                    .closest('.HanhKhach_Item_DanhXung')
                    .querySelector('.HanhKhach_Item_GioiTinh');

                HanhKhach_Item_GioiTinh.value = e.target.querySelector('.DanhXung_li_Value').innerText;

                const index = e.target.closest('.HanhKhach_Item').title;
                if (HanhKhach_Item_GioiTinh.value == 'Ông') PackageBooking.HoaDon.HanhKhach[index].GioiTinh = 0;
                else if (HanhKhach_Item_GioiTinh.value == 'Cô') PackageBooking.HoaDon.HanhKhach[index].GioiTinh = 1;
                AnHienPhanDuoi();
            });
        }

        // Helper
        const HanhKhach_Item_Header = HanhKhach_Items[i].querySelector('.HanhKhach_Item_Header');
        switch (HanhKhach_Item_Header.title) {
            case MaNguoiLon:
                HanhKhach_Items[i].querySelector('.HanhKhach_Item_Helper_NguoiLon').classList.remove('d-none');
                break;
            case MaTreEm:
                HanhKhach_Items[i].querySelector('.HanhKhach_Item_Helper_TreEm').classList.remove('d-none');
                break;
            case MaEmBe:
                HanhKhach_Items[i].querySelector('.HanhKhach_Item_Helper_EmBe').classList.remove('d-none');
                break;
            default:
                break;
        }

        // Ngày Sinh
        const HanhKhach_Item_NgaySinh_Ngay_ul = HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Ngay_ul');
        for (let j = 1; j < 31; j++) {
            const node = HanhKhach_Item_NgaySinh_Ngay_ul.querySelector('.HanhKhach_Item_NgaySinh_Ngay_li').cloneNode(
                true,
            );
            node.querySelector('.HanhKhach_Item_NgaySinh_Ngay_li_value').innerText = j + 1;
            HanhKhach_Item_NgaySinh_Ngay_ul.appendChild(node);
        }
        const HanhKhach_Item_NgaySinh_Ngay_lis = HanhKhach_Items[i].querySelectorAll(
            '.HanhKhach_Item_NgaySinh_Ngay_li',
        );
        for (let j = 0; j < HanhKhach_Item_NgaySinh_Ngay_lis.length; j++) {
            HanhKhach_Item_NgaySinh_Ngay_lis[j].addEventListener('click', (e) => {
                const HanhKhach_Item_NgaySinh_Ngay = e.target
                    .closest('.HanhKhach_Item_NgaySinh')
                    .querySelector('.HanhKhach_Item_NgaySinh_Ngay');

                HanhKhach_Item_NgaySinh_Ngay.value = e.target.querySelector(
                    '.HanhKhach_Item_NgaySinh_Ngay_li_value',
                ).innerText;

                const index = e.target.closest('.HanhKhach_Item').title;
                PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Ngay = parseInt(HanhKhach_Item_NgaySinh_Ngay.value);
                if (CheckNgaySinh(index) == false) {
                    HanhKhach_Item_NgaySinh_Ngay.value = '';
                    PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Ngay = 0;
                }
                AnHienPhanDuoi();
            });
        }

        // Tháng Sinh
        const HanhKhach_Item_NgaySinh_Thang_ul = HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Thang_ul');
        for (let j = 1; j < 12; j++) {
            const node = HanhKhach_Item_NgaySinh_Thang_ul.querySelector('.HanhKhach_Item_NgaySinh_Thang_li').cloneNode(
                true,
            );
            node.querySelector('.HanhKhach_Item_NgaySinh_Thang_li_value').innerText = 'Tháng ' + (j + 1);
            HanhKhach_Item_NgaySinh_Thang_ul.appendChild(node);
        }
        const HanhKhach_Item_NgaySinh_Thang_lis = HanhKhach_Items[i].querySelectorAll(
            '.HanhKhach_Item_NgaySinh_Thang_li',
        );
        for (let j = 0; j < HanhKhach_Item_NgaySinh_Thang_lis.length; j++) {
            HanhKhach_Item_NgaySinh_Thang_lis[j].addEventListener('click', (e) => {
                const HanhKhach_Item_NgaySinh_Thang = e.target
                    .closest('.HanhKhach_Item_NgaySinh')
                    .querySelector('.HanhKhach_Item_NgaySinh_Thang');
                HanhKhach_Item_NgaySinh_Thang.value = e.target.querySelector(
                    '.HanhKhach_Item_NgaySinh_Thang_li_value',
                ).innerText;

                const index = e.target.closest('.HanhKhach_Item').title;
                PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Thang = parseInt(
                    HanhKhach_Item_NgaySinh_Thang.value.split(' ')[1],
                );
                if (CheckNgaySinh(index) == false) {
                    HanhKhach_Item_NgaySinh_Thang.value = '';
                    PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Thang = 0;
                }
                AnHienPhanDuoi();
            });
        }

        //Nam Sinh
        const HanhKhach_Item_NgaySinh_Nam_ul = HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Nam_ul');
        var index = parseInt(HanhKhach_Items[i].title);
        let namBD = 0;
        let namKT = 0;
        namBD = new Date().getFullYear() - PackageBooking.HoaDon.HanhKhach[index].SoTuoiToiDa;
        namKT = new Date().getFullYear() - PackageBooking.HoaDon.HanhKhach[index].SoTuoiToiThieu;
        for (let j = namBD; j < namKT + 1; j++) {
            if (j == namBD) {
                HanhKhach_Item_NgaySinh_Nam_ul.querySelector('.HanhKhach_Item_NgaySinh_Nam_li').querySelector(
                    '.HanhKhach_Item_NgaySinh_Nam_li_value',
                ).innerText = j;
                continue;
            }
            const node = HanhKhach_Item_NgaySinh_Nam_ul.querySelector('.HanhKhach_Item_NgaySinh_Nam_li').cloneNode(
                true,
            );
            node.querySelector('.HanhKhach_Item_NgaySinh_Nam_li_value').innerText = j;
            HanhKhach_Item_NgaySinh_Nam_ul.appendChild(node);
        }
        const HanhKhach_Item_NgaySinh_Nam_lis = HanhKhach_Items[i].querySelectorAll('.HanhKhach_Item_NgaySinh_Nam_li');
        for (let j = 0; j < HanhKhach_Item_NgaySinh_Nam_lis.length; j++) {
            HanhKhach_Item_NgaySinh_Nam_lis[j].addEventListener('click', (e) => {
                const HanhKhach_Item_NgaySinh_Nam = e.target
                    .closest('.HanhKhach_Item_NgaySinh')
                    .querySelector('.HanhKhach_Item_NgaySinh_Nam');
                HanhKhach_Item_NgaySinh_Nam.value = e.target.querySelector(
                    '.HanhKhach_Item_NgaySinh_Nam_li_value',
                ).innerText;

                const index = e.target.closest('.HanhKhach_Item').title;
                PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Nam = parseInt(HanhKhach_Item_NgaySinh_Nam.value);
                if (CheckNgaySinh(index) == false) {
                    HanhKhach_Item_NgaySinh_Nam.value = '';
                    PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Nam = 0;
                }
                AnHienPhanDuoi();
            });
        }

        // Họ
        HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ho').addEventListener('change', (e) => {
            const index = e.target.closest('.HanhKhach_Item').title;
            PackageBooking.HoaDon.HanhKhach[index].Ho = e.target.value;

            AnHienPhanDuoi();
        });

        HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ho').addEventListener('keypress', (e) => onlyEnglish(e));
        HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ho').addEventListener('keyup', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });

        // Tên
        HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ten').addEventListener('change', (e) => {
            const index = e.target.closest('.HanhKhach_Item').title;
            PackageBooking.HoaDon.HanhKhach[index].Ten = e.target.value;

            AnHienPhanDuoi();
        });

        HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ten').addEventListener('keypress', (e) => onlyEnglish(e));
        HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ten').addEventListener('keyup', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    }
}

function CheckNgaySinh(index) {
    var hople = false;
    var nam = PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Nam;
    var thang = PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Thang;
    var ngay = PackageBooking.HoaDon.HanhKhach[index].NgaySinh.Ngay;
    if (thang < 1 || ngay < 1) {
        hople = true;
    } else if (CheckNgayThangNam(ngay, thang, nam) == 1) {
        hople = true;
    }
    if (hople == false) {
        showToast({ header: 'Ngày sinh', body: 'Không hợp lệ', duration: 5000, type: 'warning' });
    }
    return hople;
}

function CheckNgayThangNam(Ngay, Thang, Nam) {
    if (Thang == 4 || Thang == 6 || Thang == 9 || Thang == 11) {
        if (Ngay == 31) return 0;
    }
    if (Thang == 2) {
        if ((Nam % 4 == 0 && Nam % 100 != 0) || Nam % 400 == 0) {
            if (Ngay > 28) return 0;
        } else {
            if (Ngay > 29) return 0;
        }
    }
    return 1;
}

function NguoiLienHe_Input_Change() {
    // Người liên hệ
    document.getElementById('NguoiLienHe_Ho').addEventListener('change', (e) => {
        PackageBooking.HoaDon.NguoiLienHe.Ho = e.target.value;

        AnHienPhanDuoi();
    });

    document.getElementById('NguoiLienHe_Ten').addEventListener('change', (e) => {
        PackageBooking.HoaDon.NguoiLienHe.Ten = e.target.value;

        AnHienPhanDuoi();
    });

    document.getElementById('NguoiLienHe_SDT').addEventListener('change', (e) => {
        PackageBooking.HoaDon.NguoiLienHe.SDT = e.target.value;

        AnHienPhanDuoi();
    });
    document.getElementById('NguoiLienHe_Email').addEventListener('change', (e) => {
        PackageBooking.HoaDon.NguoiLienHe.Email = e.target.value;

        AnHienPhanDuoi();
    });
}

function AddEventHanhLy_Modal() {
    const ChuyenBay_lis = document.querySelectorAll('.ChuyenBay_li');
    for (let i = 0; i < ChuyenBay_lis.length; i++) {
        ChuyenBay_lis[i].addEventListener('click', (e) => {
            const ChuyenBay_lis = document.querySelectorAll('.ChuyenBay_li');
            for (let j = 0; j < ChuyenBay_lis.length; j++) {
                if (ChuyenBay_lis[j].classList.contains('bg-primary-hover'))
                    ChuyenBay_lis[j].classList.remove('bg-primary-hover');
            }
            e.target.classList.add('bg-primary-hover');

            document.getElementById('ChuyenBay_ChonHanhLy').classList.remove('d-none');
            document
                .getElementById('ChuyenBay_ChonHanhLy')
                .querySelector('.ChuyenBay_ChonHanhLy_SanBayDi_TinhThanh').innerText = e.target.querySelector(
                '.ChuyenBay_li_SanBayDi_TinhThanh',
            ).innerText;

            document
                .getElementById('ChuyenBay_ChonHanhLy')
                .querySelector('.ChuyenBay_ChonHanhLy_SanBayDi_MaSanBay').innerText = e.target.querySelector(
                '.ChuyenBay_li_SanBayDi_MaSanBay',
            ).innerText;

            document
                .getElementById('ChuyenBay_ChonHanhLy')
                .querySelector('.ChuyenBay_ChonHanhLy_SanBayDen_TinhThanh').innerText = e.target.querySelector(
                '.ChuyenBay_li_SanBayDen_TinhThanh',
            ).innerText;

            document
                .getElementById('ChuyenBay_ChonHanhLy')
                .querySelector('.ChuyenBay_ChonHanhLy_SanBayDen_MaSanBay').innerText = e.target.querySelector(
                '.ChuyenBay_li_SanBayDen_MaSanBay',
            ).innerText;

            const MaChuyenBay = e.target.title;
            document.getElementById('ChuyenBay_ChonHanhLy').title = MaChuyenBay;
            LoadHanhKhachMuaHanhLy();
        });
    }
}

function LoadHanhKhachMuaHanhLy() {
    const HanhLy_HanhKhach_Container = document.getElementById('HanhLy_HanhKhach_Container');
    const HanhLy_HanhKhach_Items = HanhLy_HanhKhach_Container.querySelectorAll('.HanhLy_HanhKhach_Item');
    if (HanhLy_HanhKhach_Items.length > 1) {
        let num = HanhLy_HanhKhach_Items.length;
        for (let i = num - 1; i > 0; i--) {
            HanhLy_HanhKhach_Container.removeChild(HanhLy_HanhKhach_Items[i]);
        }
    }

    const HanhKhachs = PackageBooking.HoaDon.HanhKhach;
    let MaEmBe = PackageBooking.HanhKhach.find((item) => item.title == 'Em bé').MaLoaiKhach;
    let SoKhach = 0;
    let ThuTu = 0;
    HanhKhachs.map((item) => {
        if (!(item.MaLoaiKhach == MaEmBe)) SoKhach++;
    });
    for (let i = 0; i < HanhKhachs.length; i++) {
        if (HanhKhachs[i].MaLoaiKhach == MaEmBe) continue;
        ThuTu++;
        const node = HanhLy_HanhKhach_Items[0].cloneNode(true);
        node.classList.remove('d-none');
        node.querySelector('.HanhLy_HanhKhach_Item_ThuTu').innerText = 'Hành khách ' + ThuTu + '/' + SoKhach;
        node.querySelector('.HanhLy_HanhKhach_Item_ThuTu').title = i;

        let danhxung = HanhKhachs[i].GioiTinh == 0 ? 'Ông' : 'Cô';
        node.querySelector('.HanhLy_HanhKhach_Item_HoTen').innerText =
            danhxung + ' ' + HanhKhachs[i].Ho + ' ' + HanhKhachs[i].Ten;

        // HanhLy_HanhKhach_li Onclick
        const HanhLy_HanhKhach_li_radios = node.querySelectorAll('.HanhLy_HanhKhach_li_radio');
        HanhLy_HanhKhach_li_radios[0].checked = true;
        for (let j = 0; j < HanhLy_HanhKhach_li_radios.length; j++) {
            HanhLy_HanhKhach_li_radios[j].name = 'HanhLy_HanhKhach_li_radio' + i;

            HanhLy_HanhKhach_li_radios[j].addEventListener('change', (e) => {
                const MaMocHanhLy = e.target.value;
                const MocHanhLy = PackageBooking.HanhLy.find((item) => item.MaMocHanhLy == MaMocHanhLy);

                e.target
                    .closest('.HanhLy_HanhKhach_Item')
                    .querySelector('.HanhLy_HanhKhach_Item_TongSoHanhLy').innerText = MocHanhLy.SoKgToiDa + ' kg';

                const MaChuyenBay = document.getElementById('ChuyenBay_ChonHanhLy').title;
                const indexHanhKhach = e.target
                    .closest('.HanhLy_HanhKhach_Item')
                    .querySelector('.HanhLy_HanhKhach_Item_ThuTu').title;

                const MangChuyenBayDat = PackageBooking.HoaDon.MangChuyenBayDat.find(
                    (item) => item.MaChuyenBay == MaChuyenBay,
                );
                MangChuyenBayDat.MaMocHanhLy[indexHanhKhach] = MocHanhLy.SoKgToiDa;

                let chuoi = '';
                MangChuyenBayDat.MaMocHanhLy.map((item) => {
                    if (item >= 0) chuoi += item + ' kg, ';
                });
                const ChuyenBay_lis = document.querySelectorAll('.ChuyenBay_li');
                let ChuyenBay_li;
                for (let z = 0; z < ChuyenBay_lis.length; z++) {
                    if (ChuyenBay_lis[z].title == MaChuyenBay) {
                        ChuyenBay_li = ChuyenBay_lis[z];
                        break;
                    }
                }
                ChuyenBay_li.querySelector('.ChuyenBay_li_MocHanhLy').innerText = chuoi;

                let tien = 0;
                MangChuyenBayDat.MaMocHanhLy.map((item) => {
                    if (item >= 0) {
                        for (let z = 0; z < PackageBooking.HanhLy.length; z++) {
                            if (PackageBooking.HanhLy[z].SoKgToiDa == item) {
                                tien += PackageBooking.HanhLy[z].GiaTien;
                            }
                        }
                    }
                });
                ChuyenBay_li.querySelector('.ChuyenBay_li_TienHanhLy').innerText = numberWithDot(tien);

                const ChuyenBay_li_TienHanhLys = document.querySelectorAll('.ChuyenBay_li_TienHanhLy');
                let sum = 0;
                for (let z = 0; z < ChuyenBay_li_TienHanhLys.length; z++) {
                    sum += parseInt(numberWithoutDot(ChuyenBay_li_TienHanhLys[z].innerText));
                }
                document.getElementById('Modal_TongPhu').innerText = numberWithDot(sum);

                // Tiện nghi Zone
                const TienNghi_Items = document.querySelectorAll('.TienNghi_Item');
                let TienNghi_Item;
                for (let z = 0; z < TienNghi_Items.length; z++) {
                    if (TienNghi_Items[z].title == MaChuyenBay) {
                        TienNghi_Item = TienNghi_Items[z];
                        break;
                    }
                }
                TienNghi_Item.querySelector('.TienNghi_Item_MocHanhLy').innerText = chuoi;
                TienNghi_Item.querySelector('.TienNghi_Item_TienHanhLy').innerText = numberWithDot(tien);
                if (tien > 0) {
                    if (TienNghi_Item.classList.contains('d-none')) {
                        TienNghi_Item.classList.remove('d-none');
                    }
                    TienNghi_Item.querySelector('.TienNghi_Item_TienHanhLy').innerText = numberWithDot(tien);
                } else if (!TienNghi_Item.classList.contains('d-none')) {
                    TienNghi_Item.classList.add('d-none');
                }

                // Tóm tắt Zone
                const TomTat_HanhLy_Items = document.querySelectorAll('.TomTat_HanhLy_Item');
                let TomTat_HanhLy_Item;
                for (let z = 0; z < TomTat_HanhLy_Items.length; z++) {
                    if (TomTat_HanhLy_Items[z].title == MaChuyenBay) {
                        TomTat_HanhLy_Item = TomTat_HanhLy_Items[z];
                        break;
                    }
                }
                if (tien > 0) {
                    if (TomTat_HanhLy_Item.classList.contains('d-none')) {
                        TomTat_HanhLy_Item.classList.remove('d-none');
                    }
                    TomTat_HanhLy_Item.querySelector('.TomTat_HanhLy_Item_GiaTien').innerText = numberWithDot(tien);
                } else if (!TomTat_HanhLy_Item.classList.contains('d-none')) {
                    TomTat_HanhLy_Item.classList.add('d-none');
                }
                CapNhatTongTien();
            });
        }

        // Gán radio nếu đã chọn trước đó
        const indexHanhKhach = i;
        const MaChuyenBay = document.getElementById('ChuyenBay_ChonHanhLy').title;
        const MangChuyenBayDat = PackageBooking.HoaDon.MangChuyenBayDat.find((item) => item.MaChuyenBay == MaChuyenBay);
        let MocHanhLyDaChon;
        for (let j = 0; j < PackageBooking.HanhLy.length; j++) {
            if (MangChuyenBayDat.MaMocHanhLy[indexHanhKhach] < 0) continue;
            if (PackageBooking.HanhLy[j].SoKgToiDa == MangChuyenBayDat.MaMocHanhLy[indexHanhKhach]) {
                MocHanhLyDaChon = structuredClone(PackageBooking.HanhLy[j]);
                break;
            }
        }
        if (MocHanhLyDaChon)
            for (let j = 0; j < HanhLy_HanhKhach_li_radios.length; j++) {
                if (HanhLy_HanhKhach_li_radios[j].value == MocHanhLyDaChon.MaMocHanhLy) {
                    HanhLy_HanhKhach_li_radios[j].checked = true;
                    HanhLy_HanhKhach_li_radios[j]
                        .closest('.HanhLy_HanhKhach_Item')
                        .querySelector('.HanhLy_HanhKhach_Item_TongSoHanhLy').innerText =
                        MocHanhLyDaChon.SoKgToiDa + ' kg';
                    break;
                }
            }

        HanhLy_HanhKhach_Container.appendChild(node);
    }
}

function TienNghiChuyenBay() {
    // Giá vé chỉ từ
    const HanhLy = PackageBooking.HanhLy.filter((item) => item.GiaTien > 0);
    let min_HanhLy = HanhLy[0];
    for (let i = 1; i < HanhLy.length; i++) {
        if (min_HanhLy.GiaTien > HanhLy[i].GiaTien) min_HanhLy = HanhLy[i];
    }
    document.getElementById('GiaHanhLy_ThapNhat').innerText = numberWithDot(min_HanhLy.GiaTien);
}

function KiemTraNhapThongTin(isClick = false) {
    let toast_header = '';
    let toast_body = '';

    const HanhKhach_Items = document.querySelectorAll('.HanhKhach_Item');
    for (let i = 0; i < HanhKhach_Items.length; i++) {
        toast_header = PackageBooking.HoaDon.HanhKhach[i].TenLoai + ' ' + PackageBooking.HoaDon.HanhKhach[i].ThuTu;

        if (HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Ngay').value == '') {
            toast_body = 'Ngày sinh còn trống';
            if (isClick == true) {
                HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Ngay').focus();
            }
            return { head: toast_header, body: toast_body, flag: false };
        }

        if (HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Thang').value == '') {
            toast_body = 'Tháng sinh còn trống';
            if (isClick == true) HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Thang').focus();
            return { head: toast_header, body: toast_body, flag: false };
        }

        if (HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Nam').value == '') {
            toast_body = 'Năm sinh còn trống';
            if (isClick == true) HanhKhach_Items[i].querySelector('.HanhKhach_Item_NgaySinh_Nam').focus();
            return { head: toast_header, body: toast_body, flag: false };
        }

        if (HanhKhach_Items[i].querySelector('.HanhKhach_Item_GioiTinh').value == '') {
            toast_body = 'Danh xưng còn trống';
            if (isClick == true) HanhKhach_Items[i].querySelector('.HanhKhach_Item_GioiTinh').focus();
            return { head: toast_header, body: toast_body, flag: false };
        }

        if (HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ho').value == '') {
            toast_body = 'Họ còn trống';
            if (isClick == true) HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ho').focus();
            return { head: toast_header, body: toast_body, flag: false };
        }

        if (HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ten').value == '') {
            toast_body = 'Tên còn trống';
            if (isClick == true) HanhKhach_Items[i].querySelector('.HanhKhach_Item_Ten').focus();
            return { head: toast_header, body: toast_body, flag: false };
        }
    }

    toast_header = 'Người liên hệ';
    toast_body = '';

    if (document.getElementById('NguoiLienHe_Ho').value == '') {
        toast_body = 'Họ của người liên hệ còn trống';
        if (isClick == true) document.getElementById('NguoiLienHe_Ho').focus();
        return { head: toast_header, body: toast_body, flag: false };
    }
    if (document.getElementById('NguoiLienHe_Ten').value == '') {
        toast_body = 'Tên của người liên hệ còn trống';
        if (isClick == true) document.getElementById('NguoiLienHe_Ten').focus();
        return { head: toast_header, body: toast_body, flag: false };
    }
    if (document.getElementById('NguoiLienHe_SDT').value == '') {
        toast_body = 'SDT của người liên hệ còn trống';
        if (isClick == true) document.getElementById('NguoiLienHe_SDT').focus();
        return { head: toast_header, body: toast_body, flag: false };
    }
    if (document.getElementById('NguoiLienHe_SDT').value.length != 10) {
        toast_body = 'SDT yêu cầu 10 kí tự';
        if (isClick == true) document.getElementById('NguoiLienHe_SDT').focus();
        return { head: toast_header, body: toast_body, flag: false };
    }
    if (document.getElementById('NguoiLienHe_Email').value == '') {
        toast_body = 'Email của người liên hệ còn trống';
        if (isClick == true) document.getElementById('NguoiLienHe_Email').focus();
        return { head: toast_header, body: toast_body, flag: false };
    }
    if (!validateEmail(document.getElementById('NguoiLienHe_Email').value)) {
        toast_body = 'Email của người liên hệ chưa hợp lệ';
        if (isClick == true) document.getElementById('NguoiLienHe_Email').focus();
        return { head: toast_header, body: toast_body, flag: false };
    }

    return { head: '', body: '', flag: true };
}

function TiepTucTren_Onclick() {
    document.getElementById('TiepTucTren').addEventListener('click', (e) => {
        let KiemTra = KiemTraNhapThongTin(true);
        if (KiemTra.flag) {
            document.getElementById('PhanDuoi').classList.remove('d-none');
            e.target.classList.add('d-none');
        } else showToast({ header: KiemTra.head, body: KiemTra.body, duration: 5000, type: 'warning' });
    });
}

function TomTat_func() {
    CapNhatTongTien();
    const TomTat_HanhKhach_TienVes = document.querySelectorAll('.TomTat_HanhKhach_TienVe');
    for (let i = 0; i < TomTat_HanhKhach_TienVes.length; i++) {
        if (parseInt(TomTat_HanhKhach_TienVes[i].innerText) <= 0) {
            const TienVe_Container = document
                .getElementById('TienVe_Container')
                .removeChild(TomTat_HanhKhach_TienVes[i].closest('.TienVe_Item'));
            continue;
        }
        TomTat_HanhKhach_TienVes[i].innerText = numberWithDot(TomTat_HanhKhach_TienVes[i].innerText);
    }
}

function CapNhatTongTien() {
    let value = 0;
    for (let i = 0; i < PackageBooking.HanhKhach.length; i++) {
        value += PackageBooking.HanhKhach[i].TongTienVe;
    }

    for (let i = 0; i < PackageBooking.HoaDon.MangChuyenBayDat.length; i++) {
        const ChuyenBay = PackageBooking.HoaDon.MangChuyenBayDat[i];
        for (let j = 0; j < ChuyenBay.MaMocHanhLy.length; j++) {
            if (ChuyenBay.MaMocHanhLy[j] < 0) continue;
            let tien = PackageBooking.HanhLy.find((item) => item.SoKgToiDa == ChuyenBay.MaMocHanhLy[j]).GiaTien;
            value += tien;
        }
    }
    document.getElementById('TomTat_TongTien').innerText = numberWithDot(value);
}

function AnHienPhanDuoi() {
    const KiemTra = KiemTraNhapThongTin(false);
    const PhanDuoi = document.getElementById('PhanDuoi');
    const TiepTucTren = document.getElementById('TiepTucTren');
    if (KiemTra.flag) {
        if (PhanDuoi.classList.contains('d-none')) {
            PhanDuoi.classList.remove('d-none');
            TiepTucTren.classList.add('d-none');
        }
    } else {
        if (!PhanDuoi.classList.contains('d-none')) {
            PhanDuoi.classList.add('d-none');
            TiepTucTren.classList.remove('d-none');
        }
    }
}

function SendForm(_PackageBooking) {
    document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    console.log(_PackageBooking);
    var book_flight_form = document.forms['book-flight-form'];
    book_flight_form.action = '/payment';
    book_flight_form.submit();
}

const TiepTucDuoi = document.getElementById('TiepTucDuoi');
if (TiepTucDuoi)
    TiepTucDuoi.addEventListener('click', () => {
        let KiemTra = KiemTraNhapThongTin(true);
        if (KiemTra.flag) {
            document.getElementById('XacNhan_Email').innerText = document.getElementById('NguoiLienHe_Email').value;
            let input = document.getElementById('MaXacNhan_input');
            input.value = '';
            const NhacNhapCode = document.getElementById('NhacNhapCode');
            if (!NhacNhapCode.classList.contains('d-none')) NhacNhapCode.classList.add('d-none');
            if (!input.classList.contains('custom-boxshadow-focus-primary')) {
                input.classList.add('custom-boxshadow-focus-primary');
            }
            if (input.classList.contains('custom-boxshadow-focus-secondary')) {
                input.classList.remove('custom-boxshadow-focus-secondary');
            }
            document.getElementById('XacNhan').disabled = true;
            new bootstrap.Modal(document.getElementById('staticBackdrop')).show();

            axios({
                method: 'post',
                url: '/validatecode',
                data: { Email: document.getElementById('XacNhan_Email').innerText.toString() },
            }).then((res) => {
                MaXacNhan = res.data.Code;
                console.log(MaXacNhan);
                document.getElementById('XacNhan').disabled = false;
            });
        } else showToast({ header: KiemTra.head, body: KiemTra.body, duration: 5000, type: 'warning' });
    });

const DoiEmail_XacNhan = document.getElementById('DoiEmail_XacNhan');
if (DoiEmail_XacNhan) {
    DoiEmail_XacNhan.addEventListener('click', (e) => {
        document.getElementById('NguoiLienHe_Email').value = '';
        document.getElementById('NguoiLienHe_Email').focus();
        const PhanDuoi = document.getElementById('PhanDuoi');
        if (!PhanDuoi.classList.contains('d-none')) {
            PhanDuoi.classList.add('d-none');
            TiepTucTren.classList.remove('d-none');
        }
    });
}

const XacNhan = document.getElementById('XacNhan');
let MaXacNhan = '';
if (XacNhan) {
    XacNhan.addEventListener('click', (e) => {
        let input = document.getElementById('MaXacNhan_input');
        if (input.value == '' || input.value != MaXacNhan) {
            const NhacNhapCode = document.getElementById('NhacNhapCode');

            if (input.value == '') NhacNhapCode.innerText = 'Bạn chưa nhập mã code!';
            else NhacNhapCode.innerText = 'Mã code không đúng!';

            if (NhacNhapCode.classList.contains('d-none')) NhacNhapCode.classList.remove('d-none');
            if (input.classList.contains('custom-boxshadow-focus-primary')) {
                input.classList.remove('custom-boxshadow-focus-primary');
            }
            if (!input.classList.contains('custom-boxshadow-focus-secondary')) {
                input.classList.add('custom-boxshadow-focus-secondary');
            }
            return;
        }
        SendForm(PackageBooking);
    });
}

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

if (GuiLaiMaXacNhan) {
    GuiLaiMaXacNhan.addEventListener('click', (e) => {
        document.getElementById('XacNhan').disabled = true;
        axios({
            method: 'post',
            url: '/validatecode',
            data: { Email: document.getElementById('XacNhan_Email').innerText.toString() },
        }).then((res) => {
            MaXacNhan = res.data.Code;
            console.log(MaXacNhan);
            document.getElementById('XacNhan').disabled = false;
        });
    });
}
