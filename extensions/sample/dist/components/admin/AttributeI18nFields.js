import React, { useEffect, useState, useCallback, useRef } from 'react';
export default function AttributeI18nFields() {
    const [data, setData] = useState(null);
    const [attributeNameAr, setAttributeNameAr] = useState('');
    const [optionTranslations, setOptionTranslations] = useState({});
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    // Keep refs for current state so the form submit event listener always accesses latest values
    const stateRef = useRef({
        attributeNameAr,
        optionTranslations,
        data
    });
    stateRef.current = {
        attributeNameAr,
        optionTranslations,
        data
    };
    // Attribute UUID comes from the edit URL: /admin/attributes/edit/<uuid>
    const entityId = window.location.pathname.match(/\/edit\/([^/?#]+)/)?.[1];
    // Load existing i18n data
    useEffect(()=>{
        if (!entityId) return;
        fetch(`/api/attributes/${entityId}/i18n`).then((r)=>r.ok ? r.json() : null).then((d)=>{
            if (!d) return;
            setData(d);
            setAttributeNameAr(d.attribute_name_i18n?.ar || '');
            const opts = {};
            d.options?.forEach((opt)=>{
                opts[String(opt.option_id)] = opt.option_text_i18n?.ar || '';
            });
            setOptionTranslations(opts);
        }).catch(()=>{});
    }, [
        entityId
    ]);
    // Save i18n data function
    const handleSave = useCallback(async ()=>{
        if (!entityId) return;
        const { attributeNameAr: currentName, optionTranslations: currentOpts, data: currentData } = stateRef.current;
        setSaving(true);
        setStatusMessage(null);
        const optionsI18n = [];
        if (currentData?.options) {
            for (const opt of currentData.options){
                const val = currentOpts[String(opt.option_id)] || '';
                optionsI18n.push({
                    option_id: opt.option_id,
                    option_text_i18n: {
                        ar: val
                    }
                });
            }
        }
        try {
            const res = await fetch(`/api/attributes/${entityId}/i18n`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    attribute_name_i18n: {
                        ar: currentName
                    },
                    options_i18n: optionsI18n
                })
            });
            if (res.ok) {
                setStatusMessage({
                    text: '✓ تم حفظ الترجمة بنجاح',
                    type: 'success'
                });
                setTimeout(()=>setStatusMessage(null), 4000);
            } else {
                const errJson = await res.json().catch(()=>({}));
                setStatusMessage({
                    text: `فشل الحفظ: ${errJson.error?.message || errJson.error || res.statusText}`,
                    type: 'error'
                });
            }
        } catch (err) {
            setStatusMessage({
                text: `فشل الاتصال: ${err.message}`,
                type: 'error'
            });
        } finally{
            setSaving(false);
        }
    }, [
        entityId
    ]);
    // Hook into the main attribute form submit so clicking the main "Save" button also saves translations
    useEffect(()=>{
        const form = document.getElementById('attributeEditForm');
        if (!form) return;
        const onFormSubmit = ()=>{
            handleSave();
        };
        form.addEventListener('submit', onFormSubmit);
        return ()=>form.removeEventListener('submit', onFormSubmit);
    }, [
        handleSave
    ]);
    // Don't render translation form on /new pages — entity doesn't exist yet
    if (!entityId) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "rounded-lg border border-border bg-card p-5 shadow-sm text-card-foreground"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "font-semibold text-base mb-1"
        }, "النسخة العربية (Arabic Translation)"), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-muted-foreground"
        }, "الترجمة متاحة بعد إنشاء الخاصية وحفظها لأول مرة."));
    }
    return /*#__PURE__*/ React.createElement("div", {
        className: "rounded-lg border border-border bg-card p-5 shadow-sm text-card-foreground"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-4"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "font-semibold text-base mb-1"
    }, "النسخة العربية (Arabic Translation)"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-muted-foreground"
    }, "أدخل الترجمة العربية لاسم الخاصية وخياراتها.")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium mb-1"
    }, "اسم الخاصية (Attribute Name - Arabic)"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        value: attributeNameAr,
        onChange: (e)=>setAttributeNameAr(e.target.value),
        placeholder: "اسم الخاصية بالعربية (مثال: الوزن، المقاس)"
    })), data?.options && data.options.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "pt-2 border-t border-border"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-semibold mb-2"
    }, "ترجمة الخيارات (Option Values)"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, data.options.map((opt)=>/*#__PURE__*/ React.createElement("div", {
            key: opt.option_id,
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "min-w-[100px] text-xs font-medium text-muted-foreground"
        }, opt.option_text, ":"), /*#__PURE__*/ React.createElement("input", {
            type: "text",
            className: "flex h-9 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            value: optionTranslations[String(opt.option_id)] || '',
            onChange: (e)=>{
                const val = e.target.value;
                setOptionTranslations((prev)=>({
                        ...prev,
                        [String(opt.option_id)]: val
                    }));
            },
            placeholder: `ترجمة "${opt.option_text}" بالعربية`
        }))))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 pt-3"
    }, /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: handleSave,
        disabled: saving,
        className: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50"
    }, saving ? 'جاري الحفظ...' : 'حفظ الترجمة'), statusMessage && /*#__PURE__*/ React.createElement("span", {
        className: `text-sm ${statusMessage.type === 'success' ? 'text-green-600 font-medium' : 'text-destructive'}`
    }, statusMessage.text)))));
}
