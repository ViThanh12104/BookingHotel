import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let sendBookingEmail = async (toEmail, bookingData) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,

        subject: "Booking Success",

        html: `
<div style="
    font-family: Arial, sans-serif;
    background:#f1f5f9;
    padding:40px 20px;
">

    <div style="
        max-width:650px;
        margin:auto;
        background:white;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 6px 20px rgba(0,0,0,0.08);
    ">

        <!-- HEADER -->
        <div style="
            background:linear-gradient(135deg,#2563eb,#1e40af);
            padding:35px;
            text-align:center;
        ">

            <h1 style="
                color:white;
                margin:0;
                font-size:30px;
            ">
                ${bookingData.HOTEL_NAME}
            </h1>

            <p style="
                color:#dbeafe;
                margin-top:10px;
                font-size:15px;
            ">
                Xác nhận đặt phòng thành công
            </p>

        </div>

        <!-- BODY -->
        <div style="padding:35px;">

            <p style="
                font-size:16px;
                color:#334155;
            ">
                Xin chào <b>${bookingData.userName}</b>,
            </p>

            <p style="
                color:#475569;
                line-height:1.8;
                margin-top:15px;
            ">
                Cảm ơn bạn đã lựa chọn 
                ${bookingData.HOTEL_NAME}.
                Đơn đặt phòng của bạn đã được xác nhận thành công.
            </p>

            <!-- BOOKING INFO -->
            <div style="
                margin-top:30px;
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:12px;
                padding:25px;
            ">

                <h2 style="
                    margin-top:0;
                    color:#0f172a;
                    font-size:20px;
                ">
                    Thông tin đặt phòng
                </h2>

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:15px;
                ">

                    <tr>
                        <td style="
                            padding:12px 0;
                            color:#64748b;
                        ">
                            Phòng
                        </td>

                        <td style="
                            text-align:right;
                            font-weight:bold;
                            color:#0f172a;
                        ">
                            ${bookingData.roomName}
                        </td>
                    </tr>

                    <tr>
                        <td style="
                            padding:12px 0;
                            color:#64748b;
                        ">
                            Ngày nhận phòng
                        </td>

                        <td style="
                            text-align:right;
                            color:#0f172a;
                        ">
                            ${bookingData.check_in}
                        </td>
                    </tr>

                    <tr>
                        <td style="
                            padding:12px 0;
                            color:#64748b;
                        ">
                            Ngày trả phòng
                        </td>

                        <td style="
                            text-align:right;
                            color:#0f172a;
                        ">
                            ${bookingData.check_out}
                        </td>
                    </tr>

                    <tr>
                        <td style="
                            padding-top:20px;
                            font-size:18px;
                            font-weight:bold;
                        ">
                            Tổng tiền
                        </td>

                        <td style="
                            text-align:right;
                            padding-top:20px;
                            font-size:24px;
                            font-weight:bold;
                            color:#dc2626;
                        ">
                            ${Number(bookingData.total_price).toLocaleString('vi-VN')} VNĐ
                        </td>
                    </tr>

                </table>

            </div>

            <!-- BUTTON -->
            <div style="
                text-align:center;
                margin-top:35px;
            ">

                <a
                    href="http://localhost:3000"
                    style="
                        background:#2563eb;
                        color:white;
                        padding:14px 30px;
                        text-decoration:none;
                        border-radius:10px;
                        display:inline-block;
                        font-weight:bold;
                        font-size:15px;
                    "
                >
                    Xem chi tiết booking
                </a>

            </div>

        </div>

        <!-- FOOTER -->
        <div style="
            background:#f8fafc;
            padding:25px;
            text-align:center;
            color:#94a3b8;
            font-size:13px;
            line-height:1.8;
        ">

       <b>${bookingData.HOTEL_NAME}</b>

        </div>

    </div>

</div>
`
    });
};

export default sendBookingEmail;