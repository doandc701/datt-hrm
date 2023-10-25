import { useApiStore } from "@/stores/api";
import { useBookingRoomStore } from "@/stores/customer/booking-room";

export const getListBooking = () => {
  const bookingRoomStore = useBookingRoomStore();
  const apiStore = useApiStore();
  let payload = {
    successCallback: (response) => {
      if (apiStore.listBooking.length === 0) {
        apiStore.listBooking = response?.data?.data?.data ?? [];
      }
    },
    errorCallback: () => {},
    query: `page=1&limit=100`,
  };
  bookingRoomStore.list_booking(payload);
};

export const removeListBooking = () => {
  const apiStore = useApiStore();
  apiStore.listBooking = [];
};
