package com.itgm.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.itgm.domain.Base;

import com.itgm.repository.BaseRepository;
import com.itgm.web.rest.util.HeaderUtil;
import com.itgm.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;
import com.itgm.service.jriaccess.Itgmrest;
import com.itgm.domain.Projeto;

/**
 * REST controller for managing Base.
 */
@RestController
@RequestMapping("/api")
public class BaseResource {

    private final Logger log = LoggerFactory.getLogger(BaseResource.class);

    private static final String ENTITY_NAME = "base";

    private final BaseRepository baseRepository;

    public BaseResource(BaseRepository baseRepository) {
        this.baseRepository = baseRepository;
    }

    /**
     * POST  /bases : Create a new base.
     *
     * @param base the base to create
     * @return the ResponseEntity with status 201 (Created) and with body the new base, or with status 400 (Bad Request) if the base has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/bases")
    @Timed
    public ResponseEntity<Base> createBase(@RequestBody Base base) throws URISyntaxException {
        log.debug("REST request to save Base : {}", base);
        if (base.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new base cannot already have an ID")).body(null);
        }

        if (base.getProjeto() == null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invaliduser", "Informe o projeto para criar o novo cenario.")).body(null);
        }

        Base result = baseRepository.save(base);

        Projeto projeto = result.getProjeto();

        if (Itgmrest.createNew(
            projeto.getUser(),
            projeto.getNome(),
            "*",
            "*",
            "bases/" + result.getId() + "/",
            result.toString())) {
            String codname = Itgmrest.getCodNome(projeto.getUser());
            String comp = codname + "/" + projeto.getNome();
            if (((String) Itgmrest.listFiles(comp + "/*/*"))
                .contains(comp + "/" + "bases/" + result.getId() + "/" + ".info")) {
                result.setLocal(comp + "/" + "bases/" + result.getId() + "/");
                result = updateBase(result).getBody();
            } else {
                return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "ITGMRestfalhou", "Erro ao tentar criar nova base.")).body(null);
            }
        }

        return ResponseEntity.created(new URI("/api/bases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }


    /**
     * PUT  /bases : Updates an existing base.
     *
     * @param base the base to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated base,
     * or with status 400 (Bad Request) if the base is not valid,
     * or with status 500 (Internal Server Error) if the base couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/bases")
    @Timed
    public ResponseEntity<Base> updateBase(@RequestBody Base base) throws URISyntaxException {
        log.debug("REST request to update Base : {}", base);
        if (base.getId() == null) {
            return createBase(base);
        }
        Base result = baseRepository.save(base);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, base.getId().toString()))
            .body(result);
    }

    /**
     * GET  /bases : get all the bases.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bases in body
     */
    @GetMapping("/bases")
    @Timed
    public ResponseEntity<List<Base>> getAllBases(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Bases");
        Page<Base> page = baseRepository.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bases");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /bases/:id : get the "id" base.
     *
     * @param id the id of the base to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the base, or with status 404 (Not Found)
     */
    @GetMapping("/bases/{id}")
    @Timed
    public ResponseEntity<Base> getBase(@PathVariable Long id) {
        log.debug("REST request to get Base : {}", id);
        Base base = baseRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(base));
    }

    /**
     * DELETE  /bases/:id : delete the "id" base.
     *
     * @param id the id of the base to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/bases/{id}")
    @Timed
    public ResponseEntity<Void> deleteBase(@PathVariable Long id) {
        log.debug("REST request to delete Base : {}", id);
        Base base = getBase(id).getBody();
        Projeto projeto = base.getProjeto();
        Itgmrest.removeDIR(
            Itgmrest.getCodNome(projeto.getUser()),
            projeto.getNome(),
            "*",
            "*",
            base.getId() + "/",
            "bases/");

        baseRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/bases/send")
    public ResponseEntity<String> baseUpload(
        @RequestParam("file") MultipartFile file,
        @RequestParam("usuario") String usuario,
        @RequestParam("projeto") String projeto,
        @RequestParam("nome") String nome,
        @RequestParam("id") String id
    ) {
        if (!Itgmrest.sendFile(usuario + "/" + projeto + "/*/*/" + nome, "bases/" + id + "/", (file))) {
            return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
        }

        ///obter campos da base
        ///load('novoarq.RData')
        ///write(gsub(', ', ',', toString(names(read.csv('arq1.csv')))), 'campos')
        String codigo = "write(gsub(', ', ',', toString(names(read.csv('" + nome + "')))), 'campos')";

        if(!nome.endsWith(".csv")){
            codigo = "load('" + nome + "')\nwrite(gsub(', ', ',', toString(names(" + nome + "))), 'campos')";
        }

        Itgmrest.executarBatch(usuario + "/" + projeto + "/bases/" + id + "/", codigo);

        return new ResponseEntity<String>(
            "{\"sucesso\":\"base enviada\"}", HttpStatus.OK);
    }

    @GetMapping("/bases/campos/{id}")
    @Timed
    public ResponseEntity<String> getBaseFields(@PathVariable Long id) {
        log.debug("REST request to get fields of Base : {}", id);
        Base base = baseRepository.findOne(id);
        String url = base.getProjeto().getUser().getLogin() + "/" + base.getProjeto().getNome() + "/*/*/campos";
        String subdir =  "bases/" + base.getId() + "/";
        String arquivo = Itgmrest.getContent(url, subdir);
        if(arquivo != null && arquivo.length() > 0){
            arquivo = arquivo.replaceAll("\n", "");
        }
        if(arquivo == null || arquivo.startsWith("error:")){
            return new ResponseEntity<String>(
                "{\"message\":\"" + arquivo.substring(6) + "\"}",
                HttpStatus.BAD_REQUEST);
        }
        String campos[] = arquivo.split(",");
        String saida = java.util.Arrays.toString(campos);
        saida = saida.replaceAll(", ", "\",\"");
        saida = saida.substring(1, saida.length() - 1);
        saida = "[\"" + saida + "\"]";
        return new ResponseEntity<String>(
            "{\"campos\":" + saida + "}", HttpStatus.OK);
    }

}
