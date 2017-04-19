package com.itgm.web.rest;

import com.itgm.ItgmApp;

import com.itgm.domain.Script;
import com.itgm.repository.ScriptRepository;
import com.itgm.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ScriptResource REST controller.
 *
 * @see ScriptResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ItgmApp.class)
public class ScriptResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restScriptMockMvc;

    private Script script;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ScriptResource scriptResource = new ScriptResource(scriptRepository);
        this.restScriptMockMvc = MockMvcBuilders.standaloneSetup(scriptResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Script createEntity(EntityManager em) {
        Script script = new Script()
            .nome(DEFAULT_NOME)
            .codigo(DEFAULT_CODIGO)
            .status(DEFAULT_STATUS);
        return script;
    }

    @Before
    public void initTest() {
        script = createEntity(em);
    }

    @Test
    @Transactional
    public void createScript() throws Exception {
        int databaseSizeBeforeCreate = scriptRepository.findAll().size();

        // Create the Script
        restScriptMockMvc.perform(post("/api/scripts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(script)))
            .andExpect(status().isCreated());

        // Validate the Script in the database
        List<Script> scriptList = scriptRepository.findAll();
        assertThat(scriptList).hasSize(databaseSizeBeforeCreate + 1);
        Script testScript = scriptList.get(scriptList.size() - 1);
        assertThat(testScript.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testScript.getCodigo()).isEqualTo(DEFAULT_CODIGO);
        assertThat(testScript.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createScriptWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = scriptRepository.findAll().size();

        // Create the Script with an existing ID
        script.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restScriptMockMvc.perform(post("/api/scripts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(script)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Script> scriptList = scriptRepository.findAll();
        assertThat(scriptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllScripts() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        // Get all the scriptList
        restScriptMockMvc.perform(get("/api/scripts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(script.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void getScript() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);

        // Get the script
        restScriptMockMvc.perform(get("/api/scripts/{id}", script.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(script.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingScript() throws Exception {
        // Get the script
        restScriptMockMvc.perform(get("/api/scripts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateScript() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);
        int databaseSizeBeforeUpdate = scriptRepository.findAll().size();

        // Update the script
        Script updatedScript = scriptRepository.findOne(script.getId());
        updatedScript
            .nome(UPDATED_NOME)
            .codigo(UPDATED_CODIGO)
            .status(UPDATED_STATUS);

        restScriptMockMvc.perform(put("/api/scripts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedScript)))
            .andExpect(status().isOk());

        // Validate the Script in the database
        List<Script> scriptList = scriptRepository.findAll();
        assertThat(scriptList).hasSize(databaseSizeBeforeUpdate);
        Script testScript = scriptList.get(scriptList.size() - 1);
        assertThat(testScript.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testScript.getCodigo()).isEqualTo(UPDATED_CODIGO);
        assertThat(testScript.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingScript() throws Exception {
        int databaseSizeBeforeUpdate = scriptRepository.findAll().size();

        // Create the Script

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restScriptMockMvc.perform(put("/api/scripts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(script)))
            .andExpect(status().isCreated());

        // Validate the Script in the database
        List<Script> scriptList = scriptRepository.findAll();
        assertThat(scriptList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteScript() throws Exception {
        // Initialize the database
        scriptRepository.saveAndFlush(script);
        int databaseSizeBeforeDelete = scriptRepository.findAll().size();

        // Get the script
        restScriptMockMvc.perform(delete("/api/scripts/{id}", script.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Script> scriptList = scriptRepository.findAll();
        assertThat(scriptList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Script.class);
    }
}
