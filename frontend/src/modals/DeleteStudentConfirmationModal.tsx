import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { deleteDoc } from "firebase/firestore";
import React, { useState } from "react";

function DeleteStudentConfirmationModal({
  isOpen,
  setIsOpen,
  toBeDeleted,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toBeDeleted: any;
}) {
  const [loading, setLoading] = useState(false);

  async function deleteStudentInfo() {
    setLoading(true);
    await deleteDoc(toBeDeleted.ref);

    const res = await fetch(
      `http://localhost:8000/fingerprints/${toBeDeleted.data().fingerprint}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      setIsOpen(false);
    } else {
      console.error("Failed to delete fingerprint data");
    }

    setLoading(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-xl w-full space-y-4 flex flex-col border border-zinc-700 rounded-md text-zinc-100 bg-zinc-800 p-6">
          <div className="flex items-center justify-between gap-16 mb-4">
            <DialogTitle className="font-semibold flex items-center gap-4">
              <Icon icon="uil:trash" className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-lg">确认删除学生资料？</span>
                <span className="text-sm font-medium uppercase tracking-wider">
                  Confirm Delete Student Information?
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
          <p className="text-zinc-400">
            你确定要删除此学生的资料与指纹吗？此操作无法撤销。
          </p>
          <p className="text-zinc-400 mt-2">
            Are you sure you want to delete this student's information? This
            action cannot be undone. The fingerprint data will also be deleted.
          </p>
          <div className="flex gap-3 w-full pt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-zinc-700 w-full text-white px-6 hover:bg-zinc-700/50 transition-all py-4 rounded-md uppercase tracking-widest"
            >
              取消 Cancel
            </button>
            <button
              onClick={() => {
                deleteStudentInfo();
              }}
              className="bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all w-full text-white px-6 py-4 rounded-md uppercase tracking-widest"
            >
              {loading ? (
                <Icon icon="svg-spinners:180-ring" className="w-6 h-6" />
              ) : (
                "删除 Delete"
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default DeleteStudentConfirmationModal;
