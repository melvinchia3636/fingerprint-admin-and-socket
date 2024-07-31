import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

function EnrollFingerprintModal({
  isOpen,
  setIsOpen,
  setFingerprintSerial,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setFingerprintSerial: (fingerprintSerial: string) => void;
}) {
  const [conn, setConn] = useState<Socket>();
  const [message, setMessage] = useState("");
  const [messageCH, setMessageCH] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [icon, setIcon] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:8000");

    setConn(socket);

    socket.on("message", (data) => {
      if (data === "place_finger") {
        setMessage("Please place your finger on the sensor");
        setMessageCH("请将手指放在传感器上");
        setIcon("tabler:fingerprint");
      }

      if (data.startsWith("existed")) {
        setMessage("Fingerprint already exists");
        setMessageCH("指纹已存在");
        setIsCompleted(true);
        setIcon("uil:exclamation-octagon··");
        setFingerprintSerial(data.split(":")[1]);
      }

      if (data === "error") {
        setMessage("Error enrolling fingerprint. Please try again.");
        setMessageCH("录取指纹时出错，请再试一次");
        setIsCompleted(true);
        setIcon("uil:exclamation-octagon");
      }

      if (data === "not_match") {
        setMessage("Fingerprints do not match. Please try again.");
        setMessageCH("指纹不匹配，请再试一次");
        setIsCompleted(true);
        setIcon("uil:exclamation-octagon");
      }

      if (data === "remove_finger") {
        setMessage("Please remove your finger");
        setMessageCH("请移开手指");
        setIcon("tabler:fingerprint-off");

        setTimeout(() => {
          setMessage("Please place your finger again on the sensor");
          setMessageCH("请将手指再次放在传感器上");
          setIcon("tabler:fingerprint");
          socket.emit("compareFinger");
        }, 2000);
      }

      if (data.startsWith("enroll_success:")) {
        setIsCompleted(true);
        setMessage(
          "Fingerprint enrolled successfully at position " + data.split(":")[1]
        );
        setMessageCH("指纹录取成功，位置：" + data.split(":")[1]);
        setIcon("uil:check-circle");
        setFingerprintSerial(data.split(":")[1]);
      }
    });

    return () => {
      socket.disconnect();
      setConn(undefined);
    };
  }, []);

  function enrollFingerprint() {
    if (conn && isOpen && !isCompleted) {
      setMessage("Please place your finger on the sensor");
      setMessageCH("请将手指放在传感器上");
      setIcon("tabler:fingerprint");
      conn.emit("enrollFinger");
    }
  }

  useEffect(() => {
    setIsCompleted(false);
    if (isOpen && conn && !isCompleted) {
      enrollFingerprint();
    }
  }, [isOpen, conn]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full space-y-4 flex flex-col border border-zinc-700 rounded-md text-zinc-100 bg-zinc-800 p-6">
          <div className="flex items-center justify-between gap-16 mb-4">
            <DialogTitle className="font-semibold flex items-center gap-4">
              <Icon icon="tabler:fingerprint" className="w-7 h-7" />
              <div className="flex flex-col">
                <span className="text-lg">录取指纹</span>
                <span className="text-sm font-medium uppercase tracking-wider">
                  Enroll Fingerprint
                </span>
              </div>
            </DialogTitle>
          </div>
          <div className="flex items-center justify-center flex-col">
            <Icon icon={icon} className="w-14 h-14 mb-2" />
            <p className="text-lg text-center">{messageCH}</p>
            <p className="text-lg text-center">{message}</p>
          </div>
          {isCompleted && (
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="bg-white text-zinc-900 block font-medium text-white px-6 py-4 mt-8 rounded-md uppercase tracking-widest"
            >
              关闭视窗 CLOSE
            </button>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default EnrollFingerprintModal;
