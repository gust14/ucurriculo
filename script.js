document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Icons ---
    lucide.createIcons();

    // --- DOM Elements ---
    const formWizard = document.getElementById('form-wizard');
    const templateSection = document.getElementById('template-section');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    const editBtn = document.getElementById('edit-btn');
    const downloadBtn = document.getElementById('download-btn');
    const templateCards = document.querySelectorAll('.template-card');
    const previewContent = document.getElementById('resume-preview-content');
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link');
    const experienceFields = document.getElementById('experience-fields');
    const addExperienceBtn = document.getElementById('add-experience');
    const educationFields = document.getElementById('education-fields');
    const addEducationBtn = document.getElementById('add-education');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const socialShareContainer = document.getElementById('social-share');


    // --- State Management ---
    let currentStep = 1;
    const totalSteps = steps.length;
    const resumeData = {
        personal: {
            links: []
        },
        experience: [],
        education: [],
        skills: {}
    };

    // --- Dynamic Fields Logic ---
    let expCount = 0;
    let eduCount = 0;
    let linkCount = 0;

    function getIconForUrl(url) {
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            if (domain.includes('linkedin.com')) return 'linkedin';
            if (domain.includes('github.com')) return 'github';
            if (domain.includes('instagram.com')) return 'instagram';
            if (domain.includes('behance.net')) return 'behance';
            if (domain.includes('dribbble.com')) return 'dribbble';
            return 'globe';
        } catch (e) {
            return 'link-2';
        }
    }

    function addLink() {
        linkCount++;
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2';
        div.innerHTML = `
            <i data-lucide="${getIconForUrl('')}" class="w-5 h-5 text-gray-400 link-icon transition-all"></i>
            <input type="text" data-key="url" placeholder="https://linkedin.com/seu-perfil" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
        `;
        linksContainer.appendChild(div);
        const input = div.querySelector('input');
        input.addEventListener('keyup', () => {
            const iconName = getIconForUrl(input.value);
            const iconElement = div.querySelector('.link-icon');
            iconElement.setAttribute('data-lucide', iconName);
            lucide.createIcons({ nodes: [iconElement] });
        });
        lucide.createIcons({ nodes: [div.querySelector('.link-icon')] });
    }

    function addExperience() {
        expCount++;
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-700 rounded-lg space-y-3';
        div.innerHTML = `
            <input type="text" data-key="title" placeholder="Cargo (Ex: Desenvolvedor Frontend)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
            <input type="text" data-key="company" placeholder="Empresa" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
            <div class="flex items-center gap-2 text-sm text-gray-400">
                <input type="text" data-key="startDate" placeholder="Início (Ex: Jan 2022)" class="w-1/2 p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
                <input type="text" data-key="endDate" placeholder="Fim (Ex: Dez 2024)" class="w-1/2 p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
                <label class="flex items-center whitespace-nowrap cursor-pointer">
                    <input type="checkbox" data-key="isCurrent" class="mr-2 rounded text-cyan-500 focus:ring-cyan-500"> Atual
                </label>
            </div>
            <textarea data-key="description" placeholder="Descrição das atividades e resultados..." rows="3" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></textarea>
        `;
        experienceFields.appendChild(div);
        const endDateInput = div.querySelector('[data-key="endDate"]');
        const isCurrentCheckbox = div.querySelector('[data-key="isCurrent"]');
        isCurrentCheckbox.addEventListener('change', () => {
            endDateInput.disabled = isCurrentCheckbox.checked;
            if (isCurrentCheckbox.checked) endDateInput.value = '';
        });
    }

    function addEducation() {
        eduCount++;
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-700 rounded-lg space-y-3';
        div.innerHTML = `
            <input type="text" data-key="course" placeholder="Curso ou Formação" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
            <input type="text" data-key="institution" placeholder="Instituição" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
            <input type="text" data-key="period" placeholder="Período (Ex: 2018 - 2022)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
        `;
        educationFields.appendChild(div);
    }

    // --- Validation Logic ---
    function validateStep(step) {
        let isValid = true;
        const currentStepDiv = document.getElementById(`step-${step}`);
        const inputs = currentStepDiv.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');

        inputs.forEach(input => {
            input.classList.remove('border-red-500', 'placeholder:text-red-400');
            // Check if input is not optional and is empty
            if (input.value.trim() === '' && !input.placeholder.toLowerCase().includes('opcional') && input.dataset.key !== 'url') {
                 // Check if it's not a disabled field (like endDate for a current job)
                if(!input.disabled) {
                    isValid = false;
                    input.classList.add('border-red-500', 'placeholder:text-red-400');
                }
            }
        });
        
        return isValid;
    }

    // --- Form Navigation & Data ---
    function updateFormView() {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${currentStep}`).classList.add('active');
        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
        prevBtn.classList.toggle('hidden', currentStep === 1);
        nextBtn.classList.toggle('hidden', currentStep === totalSteps);
        finishBtn.classList.toggle('hidden', currentStep !== totalSteps);
    }

    function saveData() {
        // Personal
        resumeData.personal.fullName = document.getElementById('fullName').value;
        resumeData.personal.email = document.getElementById('email').value;
        resumeData.personal.phone = document.getElementById('phone').value;
        resumeData.personal.summary = document.getElementById('summary').value;
        resumeData.personal.links = [];
        linksContainer.querySelectorAll('input[data-key="url"]').forEach(input => {
            if (input.value) {
                resumeData.personal.links.push({ url: input.value, icon: getIconForUrl(input.value) });
            }
        });

        // Experience
        resumeData.experience = [];
        experienceFields.querySelectorAll('div.border').forEach(expDiv => {
            const exp = {};
            expDiv.querySelectorAll('input, textarea').forEach(input => {
                exp[input.dataset.key] = input.type === 'checkbox' ? input.checked : input.value;
            });
            if (exp.title) resumeData.experience.push(exp);
        });

        // Education
        resumeData.education = [];
        educationFields.querySelectorAll('div.border').forEach(eduDiv => {
            const edu = {};
            eduDiv.querySelectorAll('input').forEach(input => {
                edu[input.dataset.key] = input.value;
            });
            if (edu.course) resumeData.education.push(edu);
        });

        // Skills
        resumeData.skills = {
            tools: document.getElementById('skills-tools').value.split(',').map(s => s.trim()).filter(Boolean),
            interpersonal: document.getElementById('skills-interpersonal').value.split(',').map(s => s.trim()).filter(Boolean),
            languages: document.getElementById('skills-languages').value.split(',').map(s => s.trim()).filter(Boolean)
        };
    }

    // --- Event Listeners ---
    addLinkBtn.addEventListener('click', addLink);
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);

    nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormView();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormView();
        }
    });

    finishBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;
        saveData();
        formWizard.classList.add('hidden');
        templateSection.classList.remove('hidden');
    });

    editBtn.addEventListener('click', () => {
        templateSection.classList.add('hidden');
        formWizard.classList.remove('hidden');
        previewContent.innerHTML = '<div class="p-8 flex items-center justify-center text-gray-400 h-full">Selecione um modelo acima para visualizar seu currículo.</div>';
        downloadBtn.disabled = true;
        downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
        templateCards.forEach(c => c.classList.remove('selected'));
    });

    // --- Template Rendering ---
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const templateName = card.dataset.template;
            renderPreview(templateName);
            downloadBtn.disabled = false;
            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    });

    async function renderPreview(template) {
        try {
            const response = await fetch(`templates/${template}.html`);
            if (!response.ok) throw new Error(`Template não encontrado: ${template}.html`);
            let templateHtml = await response.text();
            const { personal, experience, education, skills } = resumeData;

            const linksHtml = personal.links.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-x-2 text-sm hover:text-cyan-600 transition-colors">
                    <i data-lucide="${link.icon}" class="w-4 h-4 flex-shrink-0"></i>
                    <span class="truncate">${link.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}</span>
                </a>`).join('');

            const createSkillsHtml = (skillsList, categoryName) => {
                if (!skillsList || skillsList.length === 0) return '';
                const skillsItems = skillsList.map(skill => `<span class="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">${skill}</span>`).join('');
                return `<div class="break-inside-avoid"><h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">${categoryName}</h4><div class="flex flex-wrap gap-2">${skillsItems}</div></div>`;
            };
            const skillsHtml = `<div class="space-y-4">${createSkillsHtml(skills.tools, 'Ferramentas e Tecnologias')}${createSkillsHtml(skills.interpersonal, 'Habilidades Interpessoais')}${createSkillsHtml(skills.languages, 'Idiomas')}</div>`;

            const experienceHtml = experience.map(exp => {
                const period = `${exp.startDate || ''} - ${exp.isCurrent ? 'Atual' : (exp.endDate || '')}`;
                return `<div class="break-inside-avoid mb-5"><div class="flex justify-between items-baseline"><h4 class="text-lg font-bold text-gray-800">${exp.title || ''}</h4><p class="text-xs text-gray-500 font-mono pl-2 text-right whitespace-nowrap">${period}</p></div><p class="text-md text-cyan-700 font-semibold">${exp.company || ''}</p><div class="text-sm text-gray-600 mt-1.5 leading-relaxed">${(exp.description || '').replace(/\n/g, '<br>')}</div></div>`;
            }).join('');
            
            const educationHtml = education.map(edu => `
                <div class="break-inside-avoid mb-3"><h4 class="text-md font-bold text-gray-800">${edu.course || ''}</h4><p class="text-sm text-gray-700">${edu.institution || ''}</p><p class="text-xs text-gray-500">${edu.period || ''}</p></div>`).join('');

            templateHtml = templateHtml
                .replace(/{{fullName}}/g, personal.fullName || 'Seu Nome Aqui')
                .replace(/{{email}}/g, personal.email || 'seu.email@dominio.com')
                .replace(/{{phone}}/g, personal.phone || '(00) 12345-6789')
                .replace(/{{summary}}/g, (personal.summary || 'Adicione um resumo profissional conciso sobre suas qualificações e objetivos.').replace(/\n/g, '<br>'))
                .replace(/{{linksHtml}}/g, linksHtml)
                .replace(/{{skillsHtml}}/g, skillsHtml)
                .replace(/{{experienceHtml}}/g, experienceHtml)
                .replace(/{{educationHtml}}/g, educationHtml);

            previewContent.innerHTML = templateHtml;
            // Add template name as a class for specific styling
            const previewEl = previewContent.querySelector('.resume-preview');
            if(previewEl) previewEl.classList.add(template);
            lucide.createIcons();
        } catch (error) {
            console.error(error);
            previewContent.innerHTML = `<p class="text-red-400 p-8">Erro ao carregar o preview. Tente novamente.</p>`;
        }
    }

    // --- PDF Download & Modal ---
    downloadBtn.addEventListener('click', () => {
        if (downloadBtn.disabled) return;
        const content = previewContent.querySelector('.resume-preview');
        if (!content) return;
        const userName = (resumeData.personal.fullName || 'Usuario').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const options = {
            margin: 0,
            filename: `ucurriculo_${userName}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], before: '.page-break-before', avoid: '.break-inside-avoid' }
        };

        html2pdf().from(content).set(options).save().then(() => {
            showSuccessModal();
        });
    });

    function showSuccessModal() {
        lucide.createIcons(); 
        successModal.classList.remove('hidden');
    }
    function hideSuccessModal() {
        successModal.classList.add('hidden');
    }

    closeModalBtn.addEventListener('click', hideSuccessModal);
    successModal.addEventListener('click', e => {
        if (e.target === successModal) hideSuccessModal();
    });
    
    // --- Social Sharing Logic ---
    if (socialShareContainer) {
        const shareUrl = encodeURIComponent("https://14web.vercel.app/"); // Using the author's portfolio link from README
        const shareText = encodeURIComponent("Olha só, acabei de criar meu currículo de forma simples e fácil com o Ucurriculo, crie o seu também!");

        const socialLinks = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
            whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
        };

        socialShareContainer.addEventListener('click', (e) => {
            const link = e.target.closest('.social-link');
            if (!link) return;

            e.preventDefault();
            const social = link.dataset.social;

            if (socialLinks[social]) {
                window.open(socialLinks[social], '_blank', 'width=600,height=600,noopener,noreferrer');
            }
        });
    }


    // --- Initializations ---
    addLink();
    addExperience();
    addEducation();
    updateFormView();
});