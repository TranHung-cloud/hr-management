package com.hrmanagement.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class CandidateCvStorage {
    public static final long MAX_BYTES = 5L * 1024 * 1024;
    private final Path root;
    public CandidateCvStorage(@Value("${app.cv-storage-dir:./uploads/cv}") String directory) {
        root=Path.of(directory).toAbsolutePath().normalize();
    }
    public void validate(MultipartFile file) {
        if(file==null || file.isEmpty()) throw bad("Vui lòng chọn CV PDF.");
        if(file.getSize()>MAX_BYTES) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,"CV tối đa 5 MB.");
        String name=Objects.toString(file.getOriginalFilename(),"").toLowerCase(Locale.ROOT);
        if(!name.endsWith(".pdf")) throw bad("CV phải là file PDF.");
        try(var input=file.getInputStream()) {
            if(!Arrays.equals(input.readNBytes(5),"%PDF-".getBytes(StandardCharsets.US_ASCII))) throw bad("File không có định dạng PDF hợp lệ.");
        } catch(IOException e) {throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Không đọc được CV.",e);}
    }
    public String save(UUID owner, MultipartFile file) {
        validate(file);
        Path directory=root.resolve(owner.toString());
        Path target=directory.resolve(UUID.randomUUID()+".pdf");
        try {
            Files.createDirectories(directory);
            try(var input=file.getInputStream()) {Files.copy(input,target);}
        } catch(IOException e) { delete(target); throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Chưa lưu được CV. Vui lòng thử lại.",e); }
        if(TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override public void afterCompletion(int status) {if(status!=STATUS_COMMITTED) delete(target);}
            });
        }
        return "/uploads/cv/"+owner+"/"+target.getFileName();
    }
    private Path ownedPath(UUID owner,String stored) {
        String prefix="/uploads/cv/"+owner+"/";
        if(stored==null || !stored.startsWith(prefix)) return null;
        String name=stored.substring(prefix.length());
        if(!name.matches("[0-9a-fA-F-]{36}\\.pdf")) return null;
        Path path=root.resolve(owner.toString()).resolve(name).normalize();
        return path.startsWith(root.resolve(owner.toString())) ? path : null;
    }
    public boolean exists(UUID owner,String stored) {Path p=ownedPath(owner,stored);return p!=null && Files.isRegularFile(p);}
    public Resource resource(UUID owner,String stored) {
        Path p=ownedPath(owner,stored);
        if(p==null || !Files.isRegularFile(p)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Chưa có CV đã tải lên. Vui lòng cập nhật CV.");
        return new FileSystemResource(p);
    }
    public void removeOldAfterCommit(UUID owner,String stored) {
        Path old=ownedPath(owner,stored);
        if(old!=null && TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override public void afterCommit() {delete(old);}
            });
        }
    }
    private void delete(Path path) {try {Files.deleteIfExists(path);} catch(IOException ignored) { /* Do not mask a transaction failure. */ }}
    private ResponseStatusException bad(String message) {return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
}
