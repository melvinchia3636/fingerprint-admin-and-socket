import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import Input from "../Input";
import EnrollFingerprintModal from "./EnrollFingerprintModal";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase.config";

function AddStudentModal({
  openType: openType,
  setOpenType: setIsOpen,
  existedData,
}: {
  openType: "add" | "update" | false;
  setOpenType: (isOpen: "add" | "update" | false) => void;
  existedData?: any;
}) {
  const [studentID, setStudentID] = useState("");
  const [nameCH, setNameCH] = useState("");
  const [nameEN, setNameEN] = useState("");
  const [classId, setClassId] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [fingerprintSerial, setFingerprintSerial] = useState("");
  const [isEnrollFingerprintModalOpen, setIsEnrollFingerprintModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    await setDoc(doc(firestore, "students", studentID), {
      name_ch: nameCH,
      name_en: nameEN,
      class: classId,
      seat_no: seatNo,
      id: studentID,
      fingerprint: fingerprintSerial,
    });

    setIsOpen(false);
    setLoading(false);
  }

  useEffect(() => {
    if (!openType) return;

    if (openType === "add") {
      setStudentID("");
      setNameCH("");
      setNameEN("");
      setClassId("");
      setSeatNo("");
      setFingerprintSerial("");
    }

    if (openType === "update" && existedData) {
      setStudentID(existedData.id);
      setNameCH(existedData.data().name_ch);
      setNameEN(existedData.data().name_en);
      setClassId(existedData.data().class);
      setSeatNo(existedData.data().seat_no);
      setFingerprintSerial(existedData.data().fingerprint);
    }
  }, [openType]);

  return (
    <Dialog
      open={openType !== false}
      onClose={() => {}}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-xl w-full space-y-4 flex flex-col border border-zinc-700 rounded-md text-zinc-100 bg-zinc-800 p-6">
          <div className="flex items-center justify-between gap-16 mb-4">
            <DialogTitle className="font-semibold flex items-center gap-4">
              <Icon icon="uil:plus" className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-lg">新增学生资料</span>
                <span className="text-sm font-medium uppercase tracking-wider">
                  Add Student Information
                </span>
              </div>
            </DialogTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-100 transition-all"
            >
              <Icon icon="uil:times" className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-5">
            <Input
              name="学号 Student ID"
              icon="tabler:hash"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
            />
            <Input
              name="中文姓名 Chinese Name"
              icon="uil:letter-chinese-a"
              value={nameCH}
              onChange={(e) => setNameCH(e.target.value)}
            />
            <Input
              name="英文姓名 English Name"
              icon="uil:letter-english-a"
              value={nameEN}
              onChange={(e) => setNameEN(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Input
                name="班级 Class"
                icon="tabler:school"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              />
              <div className="w-3/4">
                <Input
                  name="座位号 Seat No"
                  icon="tabler:number"
                  value={seatNo}
                  onChange={(e) => setSeatNo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                name="指纹序列号 Fingerprint Serial"
                icon="tabler:fingerprint"
                value={fingerprintSerial}
                onChange={(e) => setFingerprintSerial(e.target.value)}
                disabled
              />
              <button
                onClick={() => {
                  if (fingerprintSerial) {
                    fetch(
                      `http://localhost:8000/fingerprints/${fingerprintSerial}`,
                      {
                        method: "DELETE",
                      }
                    ).then(() => {
                      setFingerprintSerial("");
                      setIsEnrollFingerprintModalOpen(true);
                    });
                  } else {
                    setIsEnrollFingerprintModalOpen(true);
                  }
                }}
                className="bg-zinc-100 font-medium hover:bg-zinc-200 transition whitespace-nowrap text-zinc-900 px-6 py-4 rounded-md uppercase tracking-widest"
              >
                {fingerprintSerial ? "重新录入 Reenroll" : "录取 Enroll"}
              </button>
            </div>
            <button
              onClick={() => {
                onSubmit();
              }}
              className="bg-blue-400 w-full font-medium hover:bg-blue-500 transition flex items-center gap-2 justify-center whitespace-nowrap text-zinc-900 px-6 py-4 rounded-md uppercase tracking-widest"
            >
              {loading ? (
                <Icon icon="svg-spinners:180-ring" className="w-6 h-6" />
              ) : (
                <>
                  <Icon
                    icon={openType === "add" ? "uil:plus" : "uil:pen"}
                    className="w-5 h-5"
                  />
                  {openType === "add" ? "创建 Create" : "更新 Update"}
                </>
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
      <EnrollFingerprintModal
        isOpen={isEnrollFingerprintModalOpen}
        setIsOpen={() => {
          setIsEnrollFingerprintModalOpen(false);
        }}
        setFingerprintSerial={setFingerprintSerial}
      />
    </Dialog>
  );
}

export default AddStudentModal;
