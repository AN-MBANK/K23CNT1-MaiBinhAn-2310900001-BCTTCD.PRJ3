package com.mbaevolution.mba_evolutionAI.utils;

import java.util.HashMap;
import java.util.Map;

public class StatusUtils {

    public static class StatusInfo {
        public final String text;
        public final String color;

        public StatusInfo(String text, String color) {
            this.text = text;
            this.color = color;
        }
    }

    private static final Map<String, StatusInfo> STATUS_MAP = new HashMap<>();
    private static final Map<String, String> MESSAGE_MAP = new HashMap<>();

    static {
        // Màu sắc và Text
        STATUS_MAP.put("PENDING", new StatusInfo("Chờ xử lý", "bg-yellow-100 text-yellow-800"));
        STATUS_MAP.put("CONFIRMED", new StatusInfo("Đã xác nhận", "bg-blue-100 text-blue-800"));
        STATUS_MAP.put("SHIPPED", new StatusInfo("Đang giao hàng", "bg-purple-100 text-purple-800"));
        STATUS_MAP.put("COMPLETED", new StatusInfo("Giao thành công", "bg-green-100 text-green-800"));
        STATUS_MAP.put("CANCELLED", new StatusInfo("Đã hủy", "bg-red-100 text-red-800"));

        // Tin nhắn trạng thái
        MESSAGE_MAP.put("PENDING", "Đơn hàng đang chờ cửa hàng xác nhận.");
        MESSAGE_MAP.put("CONFIRMED", "Đơn hàng đã được xác nhận, đang chuẩn bị hàng.");
        MESSAGE_MAP.put("SHIPPED", "Đơn vị vận chuyển đang giao hàng đến bạn.");
        MESSAGE_MAP.put("COMPLETED", "Đơn hàng đã giao thành công. Cảm ơn bạn!");
        MESSAGE_MAP.put("CANCELLED", "Đơn hàng đã bị hủy.");
    }

    public static StatusInfo getStatusInfo(String status) {
        return STATUS_MAP.getOrDefault(status, new StatusInfo(status, "bg-gray-100 text-gray-800"));
    }

    public static String getStatusMessage(String status) {
        return MESSAGE_MAP.getOrDefault(status, "Đang cập nhật trạng thái đơn hàng.");
    }
}