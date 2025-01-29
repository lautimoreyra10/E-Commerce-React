import React, { useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../components/NavBar";

interface StoreData {
  StoreName: string;
  LogoUrl: string;
  PrimaryColour: string;
  SecondaryColour: string;
}

export const AddStore: React.FC = () => {
  const { t } = useTranslation();  // Hook para usar las traducciones
  const [storeData, setStoreData] = useState<StoreData>({
    StoreName: "",
    LogoUrl: "",
    PrimaryColour: "#000000",  
    SecondaryColour: "#ffffff",
  });

  const [formErrors, setFormErrors] = useState<any>({
    StoreName: "",
    LogoUrl: "",
    PrimaryColour: "",
    SecondaryColour: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormErrors({
      ...formErrors,
      [id]: value.trim() === "" ? t('errors.required') : "",  // Traducción del error
    });

    setStoreData({ ...storeData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: any = {};

    if (!storeData.StoreName) errors.StoreName = t('errors.storeName');
    if (!storeData.LogoUrl) errors.LogoUrl = t('errors.logoUrl');
    if (!storeData.PrimaryColour) errors.PrimaryColour = t('errors.primaryColour');
    if (!storeData.SecondaryColour) errors.SecondaryColour = t('errors.secondaryColour');

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error(t('errors.completeAllFields'));  // Mensaje traducido
      return;
    }

    try {
      const response = await fetch("https://commercial-api.vulktech.com/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      if (response.ok) {
        toast.success(t('success.storeAdded'));  // Mensaje de éxito traducido
        setStoreData({
          StoreName: "",
          LogoUrl: "",
          PrimaryColour: "#000000",
          SecondaryColour: "#ffffff",
        });
        setFormErrors({
          StoreName: "",
          LogoUrl: "",
          PrimaryColour: "",
          SecondaryColour: "",
        });
        window.location.href = "/";
      } else {
        const error = await response.json();
        toast.error(`${t('errors.apiError')}: ${error.message || t('errors.default')}`);
      }
    } catch {
      toast.error(t('errors.connectionError'));
    }
  };

  return (
    <div>
      <NavBar {...{ onSearch: () => {}, searchTerm: '', searchSuggestions: [], onFilterCategory: () => {}, onSortPrice: () => {}, categories: [], onInputChange: () => {} }} />
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="w-full max-h-full p-4 bg-white">
        <h1 className="text-3xl font-bold p-4 text-center text-customText">{t('addStore.title')}</h1> {/* Título traducido */}
        <form className="flex flex-col justify-center items-center text-center" id="addStoreForm" onSubmit={handleSubmit}>
          <div className="w-full max-w-md flex flex-col items-start space-y-4">
            <div className="form-group w-full">
              <label htmlFor="name" className="block font-medium text-left">{t('addStore.storeName')}</label> {/* Etiqueta traducida */}
              <input
                id="StoreName"
                type="text"
                placeholder={t('addStore.storeNamePlaceholder')}
                value={storeData.StoreName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formErrors.StoreName && <span className="text-red-500 text-sm">{formErrors.StoreName}</span>}
            </div>

            {/* Repite el mismo patrón para el resto de los campos */}
            
            <div className="form-group w-full">
              <label htmlFor="SecondaryColour" className="block font-medium text-left">{t('addStore.secondaryColour')}</label>
              <input
                id="SecondaryColour"
                type="color"
                value={storeData.SecondaryColour}
                onChange={handleInputChange}
                className="flex align-left"
                required
              />
              {formErrors.SecondaryColour && <span className="text-red-500 text-sm">{formErrors.SecondaryColour}</span>}
            </div>

            <div className="w-full flex justify-center items-center">
              <button
                type="submit"
                className="bg-customText text-white w-full py-3 rounded hover:bg-customPrice mt-6"
              >
                {t('addStore.submit')}  {/* Botón traducido */}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddStore;
