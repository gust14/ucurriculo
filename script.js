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
    const resumeCounter = document.getElementById('resume-counter');


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
    
    function initializePlaceholderTooltips() {
        const inputs = document.querySelectorAll('input[data-placeholder], textarea[data-placeholder]');
        inputs.forEach(input => {
            if (input.scrollWidth > input.clientWidth) {
                input.classList.add('placeholder-tooltip');
            }
        });
    }

    function addLink() {
        linkCount++;
        const div = document.createElement('div');
        div.className = 'relative space-y-1';
        div.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="${getIconForUrl('')}" class="w-5 h-5 text-gray-400 link-icon transition-all"></i>
                <input type="text" data-key="url" placeholder="https://linkedin.com/seu-perfil" data-placeholder="https://linkedin.com/seu-perfil" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
            </div>
            <span class="text-red-400 text-xs pl-7 error-message hidden"></span>
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
        initializePlaceholderTooltips();
    }

    function addExperience() {
        expCount++;
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-700 rounded-lg space-y-3';
        div.innerHTML = `
            <div class="relative"><input type="text" data-key="title" placeholder="Cargo (Ex: Desenvolvedor Frontend)" data-placeholder="Cargo (Ex: Desenvolvedor Frontend)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
            <div class="relative"><input type="text" data-key="company" placeholder="Empresa" data-placeholder="Empresa" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
            <div class="flex items-center gap-2 text-sm text-gray-400">
                <div class="relative w-1/2"><input type="text" data-key="startDate" placeholder="Início (Ex: Jan 2022)" data-placeholder="Início (Ex: Jan 2022)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
                <div class="relative w-1/2"><input type="text" data-key="endDate" placeholder="Fim (Ex: Dez 2024)" data-placeholder="Fim (Ex: Dez 2024)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
                <label class="flex items-center whitespace-nowrap cursor-pointer">
                    <input type="checkbox" data-key="isCurrent" class="mr-2 rounded text-cyan-500 focus:ring-cyan-500"> Atual
                </label>
            </div>
            <div class="relative"><textarea data-key="description" placeholder="Descrição das atividades e resultados..." data-placeholder="Descrição das atividades e resultados..." rows="3" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></textarea></div>
        `;
        experienceFields.appendChild(div);
        const endDateInput = div.querySelector('[data-key="endDate"]');
        const isCurrentCheckbox = div.querySelector('[data-key="isCurrent"]');
        isCurrentCheckbox.addEventListener('change', () => {
            endDateInput.disabled = isCurrentCheckbox.checked;
            if (isCurrentCheckbox.checked) endDateInput.value = '';
        });
        initializePlaceholderTooltips();
    }

    function addEducation() {
        eduCount++;
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-700 rounded-lg space-y-3';
        div.innerHTML = `
            <div class="grid grid-cols-2 gap-3">
                 <select data-key="status" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
                    <option value="Concluído">Concluído</option>
                    <option value="Cursando">Cursando</option>
                </select>
                <select data-key="type" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none">
                    <option value="Graduação">Graduação</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Pós-graduação">Pós-graduação</option>
                    <option value="Curso Livre">Curso Livre</option>
                    <option value="Curso de Extensão">Curso de Extensão</option>
                    <option value="Workshop">Workshop</option>
                </select>
            </div>
            <div class="relative"><input type="text" data-key="course" placeholder="Curso ou Formação" data-placeholder="Curso ou Formação" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
            <div class="relative"><input type="text" data-key="institution" placeholder="Instituição" data-placeholder="Instituição" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
            <div class="flex items-center gap-2">
                 <div class="relative w-1/2"><input type="text" data-key="startDate" placeholder="Início (Ex: Jan 2022)" data-placeholder="Início (Ex: Jan 2022)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
                 <div class="relative w-1/2"><input type="text" data-key="endDate" placeholder="Conclusão (Ex: Dez 2024)" data-placeholder="Conclusão (Ex: Dez 2024)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-400 outline-none"></div>
            </div>
        `;
        educationFields.appendChild(div);
        initializePlaceholderTooltips();
    }

    // --- Validation Logic ---
    function validateStep(step) {
        let isValid = true;
        const currentStepDiv = document.getElementById(`step-${step}`);
        const inputs = currentStepDiv.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
        document.querySelectorAll('.error-message').forEach(msg => msg.classList.add('hidden'));

        inputs.forEach(input => {
            const parentDiv = input.closest('.relative') || input.parentElement;
            let errorMessageSpan = parentDiv.querySelector('.error-message');
            input.classList.remove('border-red-500', 'placeholder:text-red-400');
            if (errorMessageSpan) errorMessageSpan.classList.add('hidden');
            let hasError = false;
            let errorMessage = "Este campo é obrigatório.";

            if (input.value.trim() === '' && !input.placeholder.toLowerCase().includes('opcional') && input.dataset.key !== 'url') {
                if (!input.disabled) hasError = true;
            }
            if (input.type === 'email' && input.value.trim() !== '') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    hasError = true;
                    errorMessage = "Por favor, insira um email válido.";
                }
            }
            if (input.type === 'tel' && input.value.trim() !== '') {
                if (!/^\s*(\+?[0-9]{1,3})?[-. (]*([0-9]{2,3})[-. )]*([0-9]{3,5})[-. ]*([0-9]{4})([-. x]*[0-9]{1,5})?\s*$/.test(input.value)) {
                    hasError = true;
                    errorMessage = "Formato de telefone inválido.";
                }
            }
            if (input.dataset.key === 'url' && input.value.trim() !== '') {
                try {
                    new URL(input.value);
                } catch (_) {
                    hasError = true;
                    errorMessage = "URL inválida. Use o formato http:// ou https://";
                }
            }
            if (hasError) {
                isValid = false;
                input.classList.add('border-red-500', 'placeholder:text-red-400');
                if (errorMessageSpan) {
                    errorMessageSpan.textContent = errorMessage;
                    errorMessageSpan.classList.remove('hidden');
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

        resumeData.experience = [];
        experienceFields.querySelectorAll('div.border').forEach(expDiv => {
            const exp = {};
            expDiv.querySelectorAll('input, textarea').forEach(input => {
                exp[input.dataset.key] = input.type === 'checkbox' ? input.checked : input.value;
            });
            if (exp.title) resumeData.experience.push(exp);
        });

        resumeData.education = [];
        educationFields.querySelectorAll('div.border').forEach(eduDiv => {
            const edu = {};
            eduDiv.querySelectorAll('input, select').forEach(input => {
                edu[input.dataset.key] = input.value;
            });
            if (edu.course) resumeData.education.push(edu);
        });

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
    
    // ===============================================
    // NOVA GERAÇÃO DE HTML PARA OS TEMPLATES
    // ===============================================
    function generateLinksHtml(links) {
        return links.map(link => {
            const cleanUrl = link.url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
            return `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link-item">
                    <i data-lucide="${link.icon}" class="icon"></i>
                    <span>${cleanUrl}</span>
                </a>`;
        }).join('');
    }

    function generateSkillsHtml(skills) {
        const createCategory = (title, items) => {
            if (!items || items.length === 0) return '';
            return `
                <div class="skills-category">
                    <h4 class="skills-category-title">${title}</h4>
                    <div class="skills-list">
                        ${items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>`;
        };
        return `${createCategory('Ferramentas & Tecnologias', skills.tools)}
                ${createCategory('Habilidades Interpessoais', skills.interpersonal)}
                ${createCategory('Idiomas', skills.languages)}`;
    }

    function generateExperienceHtml(experience) {
        return experience.map(exp => {
            const period = `${exp.startDate || ''} - ${exp.isCurrent ? 'Atual' : (exp.endDate || '')}`;
            const descriptionHtml = (exp.description || '').split('\n').filter(line => line.trim() !== '').map(line => `<li>${line.trim()}</li>`).join('');
            
            return `
                <div class="experience-item">
                    <div class="experience-header">
                        <h4 class="experience-title">${exp.title || ''}</h4>
                        <span class="experience-period">${period}</span>
                    </div>
                    <p class="experience-company">${exp.company || ''}</p>
                    <ul class="experience-description">
                        ${descriptionHtml}
                    </ul>
                </div>`;
        }).join('');
    }

    function generateEducationHtml(education) {
        return education.map(edu => {
             const statusClass = edu.status === 'Cursando' ? 'status-studying' : 'status-completed';
             const period = `${edu.startDate || ''} - ${edu.endDate || ''}`.replace(/^\s*-\s*$/, '');
             return `
                <div class="education-item">
                    <div class="education-header">
                         <h4 class="education-course">${edu.course || ''}</h4>
                         <span class="education-status ${statusClass}">${edu.status || ''}</span>
                    </div>
                     <p class="education-institution">${edu.institution || ''}</p>
                    <div class="education-footer">
                        <span class="education-period">${period}</span>
                        <span class="education-type">${edu.type || ''}</span>
                    </div>
                </div>
            `;
        }).join('');
    }


    async function renderPreview(template) {
        try {
            const response = await fetch(`templates/${template}.html`);
            if (!response.ok) throw new Error(`Template não encontrado: ${template}.html`);
            let templateHtml = await response.text();
            
            const { personal, experience, education, skills } = resumeData;

            templateHtml = templateHtml
                .replace(/{{fullName}}/g, personal.fullName || 'Seu Nome Aqui')
                .replace(/{{email}}/g, personal.email || 'seu.email@dominio.com')
                .replace(/{{phone}}/g, personal.phone || '(00) 12345-6789')
                .replace(/{{summary}}/g, (personal.summary || 'Adicione um resumo profissional conciso sobre suas qualificações e objetivos.').replace(/\n/g, '<br>'))
                .replace('{{linksHtml}}', generateLinksHtml(personal.links))
                .replace('{{skillsHtml}}', generateSkillsHtml(skills))
                .replace('{{experienceHtml}}', generateExperienceHtml(experience))
                .replace('{{educationHtml}}', generateEducationHtml(education));

            previewContent.innerHTML = templateHtml;
            const previewEl = previewContent.querySelector('.resume-preview');
            if (previewEl) previewEl.classList.add(template);

            lucide.createIcons();
        } catch (error) {
            console.error("Erro ao renderizar o preview:", error);
            previewContent.innerHTML = `<p class="text-red-400 p-8">Erro ao carregar o preview. Verifique o console para mais detalhes.</p>`;
        }
    }

    // --- PDF Download & Modal ---
    downloadBtn.addEventListener('click', () => {
        if (downloadBtn.disabled) return;
        const content = previewContent.querySelector('.resume-preview');
        if (!content) return;
        const userName = (resumeData.personal.fullName || 'Usuario').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
        document.body.classList.add('pdf-generating');
    
        const options = {
            margin: 0,
            filename: `ucurriculo_${userName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                dpi: 300,
                useCORS: true,
                letterRendering: true,
                scrollY: 0 
            },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], avoid: '.break-inside-avoid' }
        };
    
        html2pdf().from(content).set(options).save().then(() => {
            document.body.classList.remove('pdf-generating');
            showSuccessModal();
            updateDownloadCount();
        }).catch(err => {
            document.body.classList.remove('pdf-generating');
            console.error("Erro ao gerar o PDF:", err);
            alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
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
        const shareUrl = encodeURIComponent("https://ucurriculo.vercel.app");
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

    // --- API Counter Logic ---
    async function getDownloadCount() {
        if (!resumeCounter) return;
        try {
            const response = await fetch('/api/counter');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            resumeCounter.innerText = data.downloads || 0;
        } catch (error) {
            console.error("Erro ao buscar o contador:", error);
            resumeCounter.innerText = 'N/A';
        } finally {
            resumeCounter.classList.remove('animate-pulse');
        }
    }

    async function updateDownloadCount() {
        if (!resumeCounter) return;
        try {
            const response = await fetch('/api/counter', { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            resumeCounter.innerText = data.downloads;
        } catch (error) {
            console.error("Erro ao atualizar o contador:", error);
        }
    }
    
    // --- Initializations ---
    addLink();
    addExperience();
    addEducation();
    updateFormView();
    getDownloadCount();
    initializePlaceholderTooltips();
});